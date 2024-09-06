import { Stack, useSegments, router } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { identifyUserType } from "@/services/user";
import { UserType } from "@/typings/user.inter";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
	const [initializing, setInitializing] = useState<boolean>(true);
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
	const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

	const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
		setUser(user);
		if (initializing) setInitializing(false);
	};

	// Check if the user has completed onboarding
	const checkOnboarding = async () => {
		const onboarded = await AsyncStorage.getItem("hasOnboarded");
		console.log("Checking onboarding", onboarded);
		setHasOnboarded(onboarded === "true");
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	useEffect(() => {
		checkOnboarding();
		console.log("Value of hasOnboarded", hasOnboarded);
	}, []);

	useEffect(() => {
		const checkUserTypeAndRedirect = async () => {
			if (initializing) return;

			// const inAuthGroup = segments[1] === "(auth)";

			const userType = await identifyUserType(user?.uid);
			const pathType = userType === UserType.homeowner ? "homeowners" : "companyowners";

			if ((!user && !hasOnboarded) || !userType) {
				router.replace("/");
			} else if (user) {
				router.replace(`/${pathType}/(auth)`);
			} else if (!user) {
				router.replace(`/${pathType}/signIn`);
			}
		};
		checkUserTypeAndRedirect();
	}, [user, initializing, hasOnboarded]);

	if (initializing) {
		return (
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					flex: 1,
				}}
			>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="userChoice" />
			</Stack>
		</GestureHandlerRootView>
	);
}
