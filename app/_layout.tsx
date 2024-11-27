import { router, Stack, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "@/contexts/userContext";
import UserContextWrapper from "./userContextWrapper";
import { StatusBar } from "expo-status-bar";
import { JobProvider } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "@/hooks/useFonts";
import * as SplashScreen from "expo-splash-screen";
import { Colors } from "./design-system/designSystem";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { name } = useGlobalSearchParams<{ name: string }>();
	const [initializing, setInitializing] = useState<boolean>(true);
	const fontsLoaded = useFonts();
	const onAuthStateChanged = () => {
		if (initializing) setInitializing(false);
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	useEffect(() => {
		if (fontsLoaded && !initializing) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, initializing]);

	const DirectMessageHeader = () => <ATText typography="heading">{name}</ATText>;
	const DirectMessageBack = () => {
		return (
			<TouchableOpacity onPress={() => router.back()}>
				<Ionicons name="arrow-back-outline" size={35}></Ionicons>
			</TouchableOpacity>
		);
	};

	if (initializing || !fontsLoaded) {
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
						<QueryClientProvider client={queryClient}>
							<Stack
								screenOptions={{
									headerShown: false,
									contentStyle: { backgroundColor: Colors.backgroundColor },
									gestureEnabled: false,
								}}
							>
								<Stack.Screen name="index" />
								<Stack.Screen
									name="shared/messages/[conversationId]"
									options={{
										gestureEnabled: true,
										headerShown: true,
										headerTitle: DirectMessageHeader,
										headerTransparent: true,
										headerLeft: () => <DirectMessageBack />,
									}}
								/>
							</Stack>
						</QueryClientProvider>
					</JobProvider>
				</UserContextWrapper>
			</UserProvider>
		</GestureHandlerRootView>
	);
}
