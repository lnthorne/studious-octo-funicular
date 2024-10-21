import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage, { deleteObject, uploadBytes } from "@react-native-firebase/storage";

import {
	ICompanyOwner,
	ICompanyOwnerEntity,
	IHomeOwner,
	IHomeOwnerEntity,
	UserType,
} from "@/typings/user.inter";

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
	userType: UserType,
	newProfileImage?: string
): Promise<T> {
	try {
		const userDocRef = firestore().collection(userType).doc(uid);

		if (newProfileImage) {
			const existingUserDoc = await userDocRef.get();
			const existingUserData = existingUserDoc.data();

			if (existingUserData?.profileImage) {
				const oldImageRef = storage().ref(`profileImages/${uid}`);
				await deleteObject(oldImageRef);
			}
			const response = await fetch(newProfileImage);
			const blob = await response.blob();
			const imageRef = storage().ref(`profileImages/${uid}`);
			await imageRef.put(blob);
			const imageUrl = await imageRef.getDownloadURL();

			user.profileImage = imageUrl;
		}

		await userDocRef.update({
			...user,
		});

		return user;
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
}
