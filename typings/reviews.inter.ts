import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface IReview {
	homeownerId: string;
	companyOwnerId: string;
	title: string;
	text: string;
	rating: number; // Between 1 and 5
}

export interface IReviewEntity extends IReview {
	rid: string;
	createdAt: FirebaseFirestoreTypes.FieldValue;
}
