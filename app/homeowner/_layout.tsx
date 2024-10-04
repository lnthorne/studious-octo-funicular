import { ATText } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Button } from "react-native";
import { TouchableOpacity } from "react-native-ui-lib";

const SignInHeader = () => {
	return <ATText typography="heading">Sign In</ATText>;
};

const SignUpHeader = () => {
	return <ATText typography="heading">Sign Up</ATText>;
};

const SignInBack = () => {
	return (
		<TouchableOpacity onPress={() => router.navigate("/userChoice")}>
			<Ionicons name="close-outline" size={35}></Ionicons>
		</TouchableOpacity>
	);
};

const SignUpBack = () => {
	return (
		<TouchableOpacity onPress={() => router.back()}>
			<Ionicons name="arrow-back-outline" size={35}></Ionicons>
		</TouchableOpacity>
	);
};

export default function HomeOwnerRootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="signIn"
				options={{
					headerTitle: () => <SignInHeader />,
					headerTransparent: true,
					headerRight: () => <SignInBack />,
				}}
			/>
			<Stack.Screen
				name="signUp"
				options={{
					headerTitle: () => <SignUpHeader />,
					headerTransparent: true,
					headerLeft: () => <SignUpBack />,
				}}
			/>
			<Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
		</Stack>
	);
}
