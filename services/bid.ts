import { BidStatus, IBid, IBidEntity, IPostEntity, JobStatus } from "@/typings/jobs.inter";
import firestore from "@react-native-firebase/firestore";

/**
 * Submit a new bid for a job post. Stores bid in firestore.
 * @param bidData - The bid data to submit
 */
export async function submitBid(bidData: IBid): Promise<void> {
	try {
		const bidRef = firestore().collection("bids").doc();

		const newBid: IBidEntity = {
			...bidData,
			bid: bidRef.id,
			createdAt: firestore.FieldValue.serverTimestamp(),
			status: BidStatus.pending,
		};

		await bidRef.set(newBid);

		await firestore()
			.collection("posts")
			.doc(bidData.pid)
			.update({
				bidIds: firestore.FieldValue.arrayUnion(bidRef.id), // Add the bid ID to the post's bids array
			});

		console.log("Bid submitted successfully:", newBid);
	} catch (error) {
		console.error("Error submitting bid:", error);
		throw error;
	}
}

/**
 * Fetch a bid from a bid ID
 * @param bid - The bid ID to fetch
 * @returns All bid data from the bid ID
 */
export async function fetchBidFromBid(bid: string): Promise<IBidEntity> {
	try {
		const bidDoc = await firestore().collection("bids").doc(bid).get();
		const bidData = bidDoc.data() as IBidEntity;

		return bidData;
	} catch (error) {
		console.error("Error fetching bid:", error);
		throw error;
	}
}
/**
 *	Fetch all bids that belong to a user ID
 * @param uid - The user ID to fetch bids from
 * @returns All the bids that belong to the user ID
 */
export async function fetchBidsFromUid(uid: string): Promise<IBidEntity[]> {
	try {
		const bidsSnapshot = await firestore().collection("bids").where("uid", "==", uid).get();

		const bids = bidsSnapshot.docs.map((doc) => {
			const data = doc.data() as IBidEntity;
			return data;
		});

		return bids;
	} catch (error) {
		console.error("Error fetching bids:", error);
		throw error;
	}
}

/**
 * Only fetches all open jobs with bids for a user ID
 * @param uid - The user ID to fetch all open jobs with bids
 * @returns Only open jobs with bids for the user ID
 */
export async function fetchAllOpenJobsWithBids(uid: string = ""): Promise<IPostEntity[]> {
	try {
		const postsSnapshot = await firestore()
			.collection("posts")
			.where("uid", "==", uid)
			.where("jobStatus", "==", "open")
			.get();

		const posts: IPostEntity[] = postsSnapshot.docs.map((doc) => doc.data() as IPostEntity);

		for (const post of posts) {
			if (post.bidIds) {
				// Fetch bids only if bidIds exist and bids array is not already populated
				const bidDocs = await Promise.all(
					post.bidIds.map((bidId) => firestore().collection("bids").doc(bidId).get())
				);

				// Map and filter the bid documents to get the actual bids
				post.bids = bidDocs
					.map((bidDoc) => bidDoc.data() as IBidEntity)
					.filter((bid) => bid.status === BidStatus.accepted || bid.status === BidStatus.pending);
			}
		}

		return posts;
	} catch (error) {
		console.error("Error fetching jobs with bids:", error);
		throw error;
	}
}

/**
 * Accept the current bid and close all other bids for a job post
 * @param bid - The bid ID to accept
 * @param pid - The post ID to close
 */
export async function acceptBidAndCloseOtherBids(bid: string, pid: string): Promise<void> {
	console.log("bid and pid", bid, pid);
	const firestoreInstance = firestore();
	const batch = firestoreInstance.batch();
	try {
		const bidRef = firestoreInstance.collection("bids").doc(bid);
		console.log("bidRef", bidRef);
		batch.update(bidRef, { status: BidStatus.accepted });

		const postRef = firestoreInstance.collection("posts").doc(pid);
		batch.update(postRef, { jobStatus: JobStatus.inprogress });

		const otherBidsSnapshot = await firestoreInstance
			.collection("bids")
			.where("pid", "==", pid)
			.where(firestore.FieldPath.documentId(), "!=", bid)
			.get();

		otherBidsSnapshot.forEach((doc) => {
			batch.update(doc.ref, { status: BidStatus.rejected });
		});

		await batch.commit();
		console.log("Bid accepted and job closed successfully");
	} catch (error) {
		console.error("Error accepting bid and closing job:", error);
		throw error;
	}
}
