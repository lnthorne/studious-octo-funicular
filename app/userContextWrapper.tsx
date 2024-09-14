import { useEffect } from "react";
import { useUser } from "@/contexts/userContext";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getUser, identifyUserType } from "@/services/user";
import { IHomeOwnerEntity, ICompanyOwnerEntity, UserType } from "@/typings/user.inter";
import { router } from "expo-router";

export default function UserContextWrapper({ children }: { children: React.ReactNode }) {
	const { setUser } = useUser<IHomeOwnerEntity | ICompanyOwnerEntity>();

	const fetchUserDataAndRedirect = async (firebaseUser: FirebaseAuthTypes.User) => {
		try {
			const userType = await identifyUserType(firebaseUser.uid);
			if (!userType) {
				return;
			}
			const userData = await getUser(userType);
			setUser(userData);

			const pathType = userType === UserType.homeowner ? "homeowners" : "companyowners";
			router.replace(`/${pathType}/(auth)/home`); // Navigate to authenticated home
		} catch (error) {
			console.error("Error fetching user data", error);
		}
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
			if (firebaseUser) {
				await fetchUserDataAndRedirect(firebaseUser);
			} else {
				router.replace("/");
			}
		});

		return subscriber;
	}, []);

	return <>{children}</>;
}
