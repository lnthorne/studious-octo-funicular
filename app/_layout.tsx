import { router, Stack, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { Colors } from "./design-system/designSystem";
import { AnimationProvider } from "@/contexts/animationContext";
import LaunchAnimation from "@/components/LaunchAnimation";

const queryClient = new QueryClient();

export default function RootLayout() {
	const { name } = useGlobalSearchParams<{ name: string }>();
	const [initializing, setInitializing] = useState<boolean>(true);
	const [isAnimationPlaying, setAnimationPlaying] = useState(true);
	const fontsLoaded = useFonts();

	useEffect(() => {
		if (fontsLoaded && initializing) {
			setInitializing(false);
		}
	}, [fontsLoaded, initializing]);

	const DirectMessageHeader = () => <ATText typography="heading">{name}</ATText>;
	const ForgotPasswordHeader = () => <ATText typography="heading">Reset Password</ATText>;
	const Back = () => {
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

	if (isAnimationPlaying) {
		return (
			<>
				<StatusBar style="dark" />
				<LaunchAnimation
					source={require("../assets/splash/splash.mp4")}
					onAnimationDone={() => setAnimationPlaying(false)}
				/>
			</>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
			<StatusBar style="dark" />
			<UserProvider>
				<UserContextWrapper>
					<JobProvider>
						<QueryClientProvider client={queryClient}>
							<AnimationProvider>
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
											headerLeft: () => <Back />,
										}}
									/>
									<Stack.Screen
										name="shared/forgotPassword"
										options={{
											gestureEnabled: true,
											headerShown: true,
											headerTitle: ForgotPasswordHeader,
											headerTransparent: true,
											headerLeft: () => <Back />,
										}}
									/>
								</Stack>
							</AnimationProvider>
						</QueryClientProvider>
					</JobProvider>
				</UserContextWrapper>
			</UserProvider>
		</GestureHandlerRootView>
	);
}
