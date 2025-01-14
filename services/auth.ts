import auth, { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

import {
	AUTH_EVENTS,
	ICompanyOwnerSignUp,
	IHomeOwnerSignUp,
	ILoginData,
} from "@/typings/auth/login.inter";
import { storeProfileImage } from "./image";
import { UserType } from "@/typings/user.inter";
import { eventEmitter } from "@/app/index";

/**
 * Call firbase auth to sign in the user and fetch the authenticate user
 * @param data - The login data of the user
 * @returns - The authenticated user
 */
export async function signIn(data: ILoginData, userType: UserType) {
	try {
		const user = await auth().signInWithEmailAndPassword(data.email, data.password);
		await AsyncStorage.setItem("uid", user.user.uid);
		eventEmitter.emit(AUTH_EVENTS.SIGN_IN, userType);
		return user.user;
	} catch (error) {
		throw error;
	}
}

/**
 * Signs out the current user
 */
export async function signOut() {
	try {
		await auth().signOut();
		await AsyncStorage.removeItem("uid");
	} catch (error) {
		throw error;
	}
}

/**
 * Use firebase auth to signup a new user
 * @param userType - The type of user to sign up
 * @param userData - The form data of the new user
 */
export async function signUp<T extends IHomeOwnerSignUp | ICompanyOwnerSignUp>(
	userType: UserType,
	userData: T
): Promise<void> {
	const { email } = userData;
	const { password, ...userDataWithoutPassword } = userData;
	try {
		const user = await auth().createUserWithEmailAndPassword(email, password);
		await AsyncStorage.setItem("uid", user.user.uid);

		const imageUrl = await storeProfileImage(user.user.uid, userData.profileImage);

		await firestore()
			.collection(userType)
			.doc(user.user.uid)
			.set({
				...userDataWithoutPassword,
				profileImage: imageUrl,
				uid: user.user.uid,
				createdAt: firestore.FieldValue.serverTimestamp(),
				updatedAt: firestore.FieldValue.serverTimestamp(),
			});

		eventEmitter.emit(AUTH_EVENTS.SIGN_IN, userType);
		console.log(`${userType} user signed up successfully!`);
	} catch (error) {
		console.error("Error signing up user:", error);
		throw error;
	}
}

/**
 * Sends a password reset email to the user.
 * @param email - The email address of the user who wants to reset their password.
 */

export async function resetPassword(email: string) {
	const auth = getAuth();
	try {
		await sendPasswordResetEmail(auth, email);
		console.log("Password reset email sent.");
	} catch (error) {
		console.error("Error sending password reset email:", error);
		throw error;
	}
}
