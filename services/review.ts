import { IReview, IReviewEntity } from "@/typings/reviews.inter";
import firestore from "@react-native-firebase/firestore";

export async function CreateReview(review: IReview) {
	const reviewRef = firestore().collection("reviews").doc();
	const newReview: IReviewEntity = {
		...review,
		rid: reviewRef.id,
		createdAt: firestore.FieldValue.serverTimestamp(),
	};
	try {
		await reviewRef.set(newReview);
		console.log("Review added successfully");
	} catch (error) {
		console.error("Error adding review:", error);
		throw error;
	}
}
