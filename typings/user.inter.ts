import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export enum UserType {
	homeowner = "homeowner",
	companyowner = "companyowner",
}

export interface IHomeOwner {
	firstname: string;
	lastname: string;
	email: string;
	zipcode: string;
	telephone: string;
	profileImage?: string;
}

export interface ICompanyOwner {
	companyName: string;
	email: string;
	zipcode: string;
	telephone: string;
	profileImage?: string;
}

export interface IHomeOwnerEntity extends IHomeOwner {
	uid: string;
	createdAt: FirebaseFirestoreTypes.FieldValue;
	updatedAt: FirebaseFirestoreTypes.FieldValue;
}

export interface ICompanyOwnerEntity extends ICompanyOwner {
	uid: string;
	createdAt: FirebaseFirestoreTypes.FieldValue;
	updatedAt: FirebaseFirestoreTypes.FieldValue;
}
