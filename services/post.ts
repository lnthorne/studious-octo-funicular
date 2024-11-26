import { BidStatus, IBidEntity, IPost, IPostEntity, JobStatus } from "@/typings/jobs.inter";
import firestore, {
	collection,
	endAt,
	getDocs,
	orderBy,
	query,
	startAt,
	where,
} from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { fetchBidFromBid } from "./bid";
import compressImageToWebP from "./image";
import { getGeoInformation } from "./geocode";
import { geohashForLocation, geohashQueryBounds, Geopoint } from "geofire-common";

export async function CreateNewPost(
	newPostContent: IPost,
	imageUris: string[]
): Promise<IPostEntity> {
	try {
		const postRef = firestore().collection("posts").doc();
		const { lat, lng } = await getGeoInformation(newPostContent.zipcode, "CA");
		const hash = geohashForLocation([lat, lng]);
		const newPost: IPostEntity = {
			...newPostContent,
			geohash: hash,
			lat,
			lng,
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
			const compressedImage = await compressImageToWebP(uri);
			if (compressedImage) {
				const response = await fetch(compressedImage);
				const blob = await response.blob();

				const imageRef = storage().ref(`posts/${postId}/image_${index + 1}.jpg`);
				await imageRef.put(blob);
				return await imageRef.getDownloadURL();
			}
			return undefined;
		});

		const imageUrls: string[] = (await Promise.all(uploadPromises)).filter(
			(url): url is string => url !== undefined
		);

		await postRef.update({
			imageUrls,
		});

		return { ...newPost, imageUrls };
	} catch (error) {
		console.error("Error creating post: ", error);
		throw error;
	}
}

export async function fetchOpenJobPostsNotBidOn(
	uid: string,
	radius: number,
	center?: Geopoint
): Promise<IPostEntity[]> {
	try {
		const db = firestore();
		const radiusInM = radius * 1000;

		let postsSnapshots;

		if (center && radius) {
			const bounds = geohashQueryBounds(center, radiusInM);
			const promises = [];

			for (const b of bounds) {
				const q = query(
					collection(db, "posts"),
					where("jobStatus", "==", JobStatus.open),
					orderBy("geohash"),
					startAt(b[0]),
					endAt(b[1])
				);
				promises.push(getDocs(q)); // Execute the query and collect results
			}

			postsSnapshots = await Promise.all(promises);
		} else {
			// If no center is specified, fetch all open jobs
			const q = query(collection(db, "posts"), where("jobStatus", "==", JobStatus.open));
			postsSnapshots = [await getDocs(q)];
		}

		const userBidsSnapshot = await db.collection("bids").where("uid", "==", uid).get();

		const jobIdsWithUserBids = new Set(
			userBidsSnapshot.docs.map((doc) => {
				const bid = doc.data() as IBidEntity;
				return bid.pid;
			})
		);

		const posts = postsSnapshots
			.flatMap((snapshot) => snapshot.docs)
			.map((doc) => doc.data() as IPostEntity)
			.filter((post) => !jobIdsWithUserBids.has(post.pid));

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
 * @param statuses - The job status to fetch
 * @returns Only open jobs with bids for the user ID
 */
export async function fetchJobsWithBidsByStatus(
	uid: string,
	statuses: JobStatus[]
): Promise<IPostEntity[]> {
	try {
		const postsSnapshot = await firestore()
			.collection("posts")
			.where("uid", "==", uid)
			.where("jobStatus", "in", statuses)
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

export async function fetchJobPostsByPidAndStaus(pids: string[]): Promise<IPostEntity[]> {
	try {
		const db = firestore();

		const postsCollection = db.collection("posts");
		const promises = pids.map(async (pid) => {
			const doc = await postsCollection.doc(pid).get();
			if (doc.exists) {
				return {
					...doc.data(),
				} as IPostEntity;
			}
			return null;
		});

		const results = await Promise.all(promises);
		return results.filter((post) => post !== null);
	} catch (error) {
		console.error("Error fetching job postings:", error);
		throw error;
	}
}
