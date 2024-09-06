import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export enum UserType {
	homeowner = "homeowner",
	companyowner = "companyowner",
}

export interface IHomeOwner {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	zipcode: string;
	telephone: string;
}

export interface ICompanyOwner {
	companyName: string;
	email: string;
	password: string;
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
