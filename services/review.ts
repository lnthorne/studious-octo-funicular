import { IReview, IReviewEntity, ReviewSummary } from "@/typings/reviews.inter";
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

export async function fetchCompanyReviews(companyId: string): Promise<IReviewEntity[]> {
	console.log("Comapny id", companyId);
	try {
		const reviewsSnapshot = await firestore()
			.collection("reviews")
			.where("companyOwnerId", "==", companyId)
			.get();

		const reviews = reviewsSnapshot.docs.map((doc) => {
			const data = doc.data() as IReviewEntity;
			return data;
		});
		return reviews;
	} catch (error) {
		console.error("Error fetching company reviews:", error);
		throw error;
	}
}

export function calculateReviewSummary(reviews: IReviewEntity[]): ReviewSummary {
	const totalReviews = reviews.length;
	const ratingCounts = [0, 0, 0, 0, 0]; // Array to hold counts for each rating from 1 to 5 stars

	let totalRating = 0;

	reviews.forEach((review) => {
		totalRating += review.rating;
		ratingCounts[review.rating - 1] += 1;
	});

	const averageRating = totalRating / totalReviews;
	const ratingPercentages = ratingCounts.map((count) =>
		parseFloat((count / totalReviews).toFixed(2))
	);

	return {
		totalReviews,
		averageRating: parseFloat(averageRating.toFixed(1)),
		ratingPercentages, // [%, %, %, %, %] for 5 stars down to 1 star
	};
}
