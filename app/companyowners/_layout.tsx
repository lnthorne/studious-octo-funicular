import { Stack, router } from "expo-router";
import { Button } from "react-native";

export default function CompanyOwnerRootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="signIn"
				options={{
					headerTitle: "Sign In",
					headerShown: true,
					headerBackTitleVisible: true,
					headerTransparent: true,
					headerLeft: () => <Button title="Back" onPress={() => router.replace("/")} />,
				}}
			/>
			<Stack.Screen
				name="signUp"
				options={{
					headerShown: true,
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
