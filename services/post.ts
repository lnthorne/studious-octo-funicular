import { IBidEntity, IPost, IPostEntity, JobStatus } from "@/typings/jobs.inter";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export async function CreateNewPost(newPostContent: IPost, imageUri: string | null) {
	try {
		const postRef = firestore().collection("posts").doc();
		const newPost: IPostEntity = {
			...newPostContent,
			pid: postRef.id,
			createdAt: firestore.FieldValue.serverTimestamp(),
			jobStatus: JobStatus.open,
		};

		await postRef.set(newPost);
		const postId = postRef.id;
		let imageUrl = null;

		if (imageUri) {
			// Convert image URI to Blob
			const imageRef = storage().ref(`posts/${postId}/image.jpg`);

			// Upload the image file to Firebase Storage
			await imageRef.putFile(imageUri);

			// Get the download URL of the uploaded image
			imageUrl = await imageRef.getDownloadURL();

			// Update the post document with the image URL
			await postRef.update({
				imageUrl,
			});
		}

		return { postId, imageUrl };
	} catch (error) {
		console.error("Error creating post: ", error);
		throw error;
	}
}

export async function fetchAllOpenJobPosts(): Promise<IPostEntity[]> {
	try {
		const postsSnapshot = await firestore()
			.collection("posts")
			.where("jobStatus", "==", JobStatus.open)
			.get();

		const posts = postsSnapshot.docs.map((doc) => {
			const data = doc.data() as IPostEntity;
			return data;
		});

		return posts;
	} catch (error) {
		console.error("Error fetching open job posts: ", error);
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
