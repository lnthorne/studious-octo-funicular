import { ATText } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native-ui-lib";

const JobDetailsHeader = () => {
	return <ATText typography="subheading">Job Details</ATText>;
};

const Close = () => {
	return (
		<TouchableOpacity onPress={() => router.back()}>
			<Ionicons name="close-outline" size={35}></Ionicons>
		</TouchableOpacity>
	);
};

export default function AuthenticateRootLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen
				name="jobDetails/[postId]"
				options={{
					headerShown: true,
					headerTransparent: true,
					headerTitle: () => <JobDetailsHeader />,
					headerRight: () => <Close />,
					headerBackVisible: false,
				}}
			/>
		</Stack>
	);
}
