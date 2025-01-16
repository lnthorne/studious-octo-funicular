import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export enum JobStatus {
	completed = "completed",
	closed = "closed",
	inprogress = "inprogress",
	open = "open",
	canceled = "canceled",
}

export enum BidStatus {
	accepted = "accepted",
	rejected = "rejected",
	pending = "pending",
	completed = "completed",
	waiting = "waiting",
	canceled = "canceled",
}

export interface IBid {
	pid: string;
	uid: string; // uid of the company owner
	companyName: string;
	bidAmount: number;
	description: string;
	date: Date; // Estimated Start date
}

export interface IBidEntity extends IBid {
	companyProfilePicture?: string;
	bid: string;
	createdAt: FirebaseFirestoreTypes.FieldValue;
	lastUpdatedAt: FirebaseFirestoreTypes.FieldValue;
	status: BidStatus;
}

export interface IPost {
	uid: string; //uid of the homeowner
	title: string;
	description: string;
	zipcode: string;
	estimatedStartDate: Date;
	imageUrls?: string[];
	bidIds?: string[];
}

export interface IPostEntity extends IPost {
	pid: string;
	jobStatus: JobStatus;
	createdAt: FirebaseFirestoreTypes.FieldValue;
	completionConfirmed: { [uid: string]: boolean };
	geohash: string;
	lat: number;
	lng: number;
	winningBidId?: string;
	bids?: IBidEntity[]; // NOTE: This is not stored in Firestore, but is populated when fetching posts
}
