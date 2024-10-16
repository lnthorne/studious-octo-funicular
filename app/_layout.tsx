import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/contexts/userContext";
import UserContextWrapper from "./userContextWrapper";
import { Colors } from "react-native-ui-lib";
import { StatusBar } from "expo-status-bar";
import { JobProvider } from "@/contexts/jobContext";
export default function RootLayout() {
	const [initializing, setInitializing] = useState<boolean>(true);

	const onAuthStateChanged = () => {
		if (initializing) setInitializing(false);
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

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
			<StatusBar style="dark" />
			<UserProvider>
				<UserContextWrapper>
					<JobProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="index" />
						</Stack>
					</JobProvider>
				</UserContextWrapper>
			</UserProvider>
		</GestureHandlerRootView>
	);
}
