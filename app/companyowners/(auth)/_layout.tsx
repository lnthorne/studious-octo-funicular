import { Stack } from "expo-router";

export default function AuthenticateRootLayout() {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="createBid/[posting]"
				options={{
					headerTitle: "The Job to bid on",
					headerShown: true,
					headerBackTitleVisible: false,
				}}
			/>
			<Stack.Screen
				name="bidDetails/[bid]"
				options={{
					headerTitle: "Your Bid",
					headerShown: true,
					headerBackTitleVisible: false,
				}}
			/>
		</Stack>
	);
}
