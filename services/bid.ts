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
 *	Fetch bids that belong to a user ID and match the required status
 * @param uid - The user ID to fetch bids from
 * @param BidStatus - The current status that the bid is in
 * @returns All the bids that belong to the user ID
 */
export async function fetchBidsFromUid(uid: string, BidStatus: BidStatus): Promise<IBidEntity[]> {
	try {
		const bidsSnapshot = await firestore()
			.collection("bids")
			.where("uid", "==", uid)
			.where("status", "==", BidStatus)
			.get();

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
 * Accept the current bid and close all other bids for a job post
 * @param bid - The bid ID to accept
 * @param pid - The post ID to close
 * @param uid - The user ID of the bid maker (company owner)
 */
export async function acceptBidAndCloseOtherBids(
	bid: string,
	pid: string,
	uid: string
): Promise<void> {
	const firestoreInstance = firestore();
	const batch = firestoreInstance.batch();
	try {
		const bidRef = firestoreInstance.collection("bids").doc(bid);
		batch.update(bidRef, { status: BidStatus.accepted });

		const postRef = firestoreInstance.collection("posts").doc(pid);
		batch.update(postRef, {
			jobStatus: JobStatus.inprogress,
			winningBidId: bid,
			[`completionConfirmed.${uid}`]: false,
		});

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
