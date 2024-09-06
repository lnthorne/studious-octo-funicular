import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

import { ILoginData } from "@/typings/auth/login.inter";
import { ICompanyOwner, IHomeOwner, UserType } from "@/typings/user.inter";

export async function signIn(data: ILoginData) {
	try {
		const user = await auth().signInWithEmailAndPassword(data.email, data.password);
		await AsyncStorage.setItem("uid", user.user.uid);
		return user;
	} catch (error) {
		throw error;
	}
}

export async function signOut() {
	try {
		await auth().signOut();
		await AsyncStorage.removeItem("uid");
	} catch (error) {
		throw error;
	}
}

export async function signUp<T extends IHomeOwner | ICompanyOwner>(
	userType: UserType,
	userData: T
): Promise<void> {
	const { email, password } = userData;
	try {
		const user = await auth().createUserWithEmailAndPassword(email, password);
		await AsyncStorage.setItem("uid", user.user.uid);

		await firestore()
			.collection(userType)
			.doc(user.user.uid)
			.set({
				...userData,
				uid: user.user.uid,
				createdAt: firestore.FieldValue.serverTimestamp(),
				updatedAt: firestore.FieldValue.serverTimestamp(),
			});
		console.log(`${userType} user signed up successfully!`);
	} catch (error) {
		console.error("Error signing up user:", error);
		throw error;
	}
}
