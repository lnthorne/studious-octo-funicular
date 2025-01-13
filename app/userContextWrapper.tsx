import { useEffect } from "react";
import { useUser } from "@/contexts/userContext";
import { getUser } from "@/services/user";
import { IHomeOwnerEntity, ICompanyOwnerEntity, UserType } from "@/typings/user.inter";
import { router } from "expo-router";
import { AUTH_EVENTS } from "@/typings/auth/login.inter";
import { eventEmitter } from "./index";

export default function UserContextWrapper({ children }: { children: React.ReactNode }) {
	const { setUser } = useUser<IHomeOwnerEntity | ICompanyOwnerEntity>();

	const fetchUserDataAndRedirect = async (userType: UserType) => {
		try {
			const userData = await getUser(userType);
			if (!userData) {
				console.error("No user data found");
				return;
			}
			setUser(userData);
			router.replace(`/${userType}/home`);
			console.log("Succesfully fetched user");
		} catch (error) {
			console.error("Error fetching user data", error);
		}
	};

	useEffect(() => {
		eventEmitter.addListener(AUTH_EVENTS.SIGN_IN, fetchUserDataAndRedirect);

		return () => {
			eventEmitter.removeAllListeners(AUTH_EVENTS.SIGN_IN);
		};
	}, []);

	return <>{children}</>;
}
