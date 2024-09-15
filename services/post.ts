import { BidStatus, IBidEntity, IPost, IPostEntity, JobStatus } from "@/typings/jobs.inter";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { fetchBidFromBid } from "./bid";

export async function CreateNewPost(newPostContent: IPost, imageUris: string[]) {
	try {
		const postRef = firestore().collection("posts").doc();
		const newPost: IPostEntity = {
			...newPostContent,
			pid: postRef.id,
			createdAt: firestore.FieldValue.serverTimestamp(),
			jobStatus: JobStatus.open,
			completionConfirmed: {
				[newPostContent.uid]: false,
			},
		};

		await postRef.set(newPost);
		const postId = postRef.id;

		const uploadPromises = imageUris.map(async (uri, index) => {
			const response = await fetch(uri);
			const blob = await response.blob();

			const imageRef = storage().ref(`posts/${postId}/image_${index + 1}.jpg`);
			await imageRef.put(blob);
			return await imageRef.getDownloadURL();
		});

		const imageUrls: string[] = await Promise.all(uploadPromises);

		await postRef.update({
			imageUrls,
		});

		return { postId, imageUrls };
	} catch (error) {
		console.error("Error creating post: ", error);
		throw error;
	}
}

export async function fetchOpenJobPostsNotBidOn(uid: string): Promise<IPostEntity[]> {
	try {
		const userBidsSnapshot = await firestore().collection("bids").where("uid", "==", uid).get();

		const jobIdsWithUserBids = userBidsSnapshot.docs.map((doc) => {
			const bid = doc.data() as IBidEntity;
			return bid.pid;
		});

		const postsSnapshot = await firestore()
			.collection("posts")
			.where("jobStatus", "==", JobStatus.open)
			.get();

		// TODO: This should be filtered in the query itself
		const posts = postsSnapshot.docs
			.map((doc) => {
				const data = doc.data() as IPostEntity;
				return data;
			})
			.filter((post) => !jobIdsWithUserBids.includes(post.pid)); // Filter out jobs with the same ID as in `jobIdsWithUserBids`

		return posts;
	} catch (error) {
		console.error("Error fetching open job posts: ", error);
		throw error;
	}
}

export async function fetchPost(pid: string): Promise<IPostEntity | null> {
	try {
		const postDoc = await firestore().collection("posts").doc(pid).get();
		if (!postDoc.exists) {
			return null;
		}

		const postData = postDoc.data() as IPostEntity;
		return postData;
	} catch (error) {
		console.error("Error fetching post: ", error);
		throw error;
	}
}

/**
 * Fetch jobs and bids depending on the user ID and Job status
 * @param uid - The user ID to fetch all open jobs with bids
 * @param jobStatus - The job status to fetch
 * @returns Only open jobs with bids for the user ID
 */
export async function fetchJobsWithBidsByStatus(
	uid: string,
	jobStatus: JobStatus
): Promise<IPostEntity[]> {
	try {
		const postsSnapshot = await firestore()
			.collection("posts")
			.where("uid", "==", uid)
			.where("jobStatus", "==", jobStatus)
			.get();

		const posts: IPostEntity[] = postsSnapshot.docs.map((doc) => doc.data() as IPostEntity);

		for (const post of posts) {
			if (post.bidIds) {
				// Fetch bids only if bidIds exist and bids array is not already populated
				const bidDocs = await Promise.all(
					post.bidIds.map((bidId) => firestore().collection("bids").doc(bidId).get())
				);

				// Map and filter the bid documents to get the actual bids
				// TODO: Filter this in the query itself
				post.bids = bidDocs
					.map((bidDoc) => bidDoc.data() as IBidEntity)
					.filter((bid) => bid.status !== BidStatus.rejected);
			}
		}

		return posts;
	} catch (error) {
		console.error("Error fetching jobs with bids:", error);
		throw error;
	}
}

export async function fetchInProgressPost(pid: string): Promise<IPostEntity | null> {
	try {
		const post = await fetchPost(pid);
		if (!post) return null;
		if (post.winningBidId) {
			post.bids = [await fetchBidFromBid(post.winningBidId)];
		}
		return post;
	} catch (error) {
		console.error("Error fetching in-progress posts: ", error);
		throw error;
	}
}

export async function updatePostCompletionStatus(pid: string, uid: string): Promise<void> {
	try {
		const postRef = firestore().collection("posts").doc(pid);
		await postRef.update({
			[`completionConfirmed.${uid}`]: true,
		});
	} catch (error) {
		console.error("Error updating post completion status: ", error);
		throw error;
	}
}

export async function checkAndClosePostingAndBid(pid: string, bidId: string): Promise<void> {
	const firestoreInstance = firestore();
	const batch = firestoreInstance.batch();
	try {
		const postRef = firestoreInstance.collection("posts").doc(pid);
		const postsSnapshot = await postRef.get();
		const postData = postsSnapshot.data() as IPostEntity;

		if (!postData || !postData.completionConfirmed) {
			console.error("Post data not found or no completionConfirmed field");
			return;
		}

		const { completionConfirmed } = postData;

		const allConfirmed = Object.values(completionConfirmed).every((status) => status === true);

		if (!allConfirmed) {
			console.error("Not all bids have been confirmed");
			return;
		}

		batch.update(postRef, {
			jobStatus: JobStatus.completed,
		});

		const bidRef = firestoreInstance.collection("bids").doc(bidId);
		batch.update(bidRef, {
			status: BidStatus.completed,
		});

		await batch.commit();
	} catch (error) {
		console.error("Error closing posting: ", error);
		throw error;
	}
}
