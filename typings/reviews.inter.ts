import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { number } from "yup";

export interface IReview {
	homeownerId: string;
	companyOwnerId: string;
	homeownerFirstName: string;
	homeownerLastName: string;
	title?: string;
	text?: string;
	rating: number; // Between 1 and 5
}

export interface IReviewEntity extends IReview {
	rid: string;
	createdAt: FirebaseFirestoreTypes.FieldValue;
}

export interface ReviewForm {
	rating: number;
	title?: string;
	text?: string;
}

export interface ReviewSummary {
	totalReviews: number;
	averageRating: number;
	ratingPercentages: number[];
}
