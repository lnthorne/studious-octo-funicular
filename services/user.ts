import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import storage, { deleteObject, uploadBytes } from "@react-native-firebase/storage";

import {
	ICompanyOwner,
	ICompanyOwnerEntity,
	IHomeOwner,
	IHomeOwnerEntity,
	UserType,
} from "@/typings/user.inter";
import { compressImageToWebP, storeProfileImage } from "./image";

/**
 * get the current user ID
 * @returns The user ID of the current user
 */
export async function getUserId(): Promise<string | null> {
	try {
		const userId = await AsyncStorage.getItem("uid");
		if (userId) {
			return userId;
		}

		const currentUser = auth().currentUser;
		if (currentUser) {
			await AsyncStorage.setItem("uid", currentUser.uid);
			return currentUser.uid;
		}

		return null;
	} catch (error) {
		console.error("Error getting user ID", error);
		throw error;
	}
}

/**
 * Get the current user data
 * @param userType - The type of user to get, used to determine the collection to get the user from
 * @returns The user data of the current user
 */
export async function getUser<T extends IHomeOwnerEntity | ICompanyOwnerEntity>(
	userType: UserType
): Promise<T | null> {
	try {
		const userId = await getUserId();
		if (!userId) {
			return null;
		}
		const userDocument = await firestore().collection(userType).doc(userId).get();
		const userData = userDocument.data() as T | null;

		return userData;
	} catch (error) {
		console.error("Error getting user data", error);
		throw error;
	}
}

/**
 *	Identify the type of user
 * @param uid - The user ID you want to identify the type of user
 * @returns The type of user
 */
export async function identifyUserType(uid: string = ""): Promise<UserType | null> {
	try {
		const homeownerDoc = await firestore().collection(UserType.homeowner).doc(uid).get();
		if (homeownerDoc.exists) {
			return UserType.homeowner;
		}

		const companyOwnerDoc = await firestore().collection(UserType.companyowner).doc(uid).get();
		if (companyOwnerDoc.exists) {
			return UserType.companyowner;
		}
		return null;
	} catch (error) {
		console.error("Error identifying user type", error);
		throw error;
	}
}

/**
 *
 * @param user either IHomeOwner or ICompanyOwner
 * @param userType type of the user
 * @returns updated user upon success, else throws an error
 */

export async function updateUser<T extends IHomeOwner | ICompanyOwner>(
	uid: string,
	user: T,
	userType: UserType
): Promise<T> {
	try {
		const userDocRef = firestore().collection(userType).doc(uid);

		await userDocRef.update({
			...user,
		});

		return user;
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
}

/**
 *
 * @param uid User id
 * @param newProfileImage The uri of the image to be uploaded
 * @param userType
 * @returns The url of the uploaded image
 */
export async function updateProfileImage(
	uid: string,
	newProfileImage: string,
	userType: UserType
): Promise<string> {
	try {
		const userDocRef = firestore().collection(userType).doc(uid);
		const existingUserDoc = await userDocRef.get();
		const existingUserData = existingUserDoc.data();

		if (existingUserData?.profileImage) {
			const oldImageRef = storage().ref(`profileImages/${uid}`);
			await deleteObject(oldImageRef);
		}

		const imageUrl = await storeProfileImage(uid, newProfileImage);

		await userDocRef.update({
			profileImage: imageUrl,
		});

		return imageUrl;
	} catch (error) {
		console.error("Error updating profile image:", error);
		throw error;
	}
}

export async function fetchUserNames(
	userIds: string[],
	userType: UserType
): Promise<FirebaseFirestoreTypes.DocumentData[]> {
	if (userIds.length === 0) return [];

	const batches = [];

	while (userIds.length) {
		const batchIds = userIds.splice(0, 10);
		const userQuery = firestore()
			.collection(userType)
			.where(firestore.FieldPath.documentId(), "in", batchIds);
		batches.push(userQuery.get());
	}

	const results = await Promise.all(batches);
	const usersData = results.flatMap((result) => result.docs.map((doc) => doc.data()));
	return usersData;
}
