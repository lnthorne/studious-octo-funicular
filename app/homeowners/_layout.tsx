import { Stack, router } from "expo-router";
import { Button } from "react-native";

export default function HomeOwnerRootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="signIn"
				options={{
					headerTitle: "Sign In",
					headerShown: false,
					headerBackTitleVisible: true,
					headerTransparent: true,
					headerLeft: () => <Button title="Back" onPress={() => router.replace("/")} />,
				}}
			/>
			<Stack.Screen
				name="signUp"
				options={{
					headerShown: false,
					headerTitle: "Sign Up",
					headerBackTitleVisible: false,
					headerTransparent: true,
					headerLeft: () => <Button title="Back" onPress={() => router.replace("/")} />,
				}}
			/>
			<Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
		</Stack>
	);
}
