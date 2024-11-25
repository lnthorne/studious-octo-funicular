import { ATText } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native-ui-lib";

const JobDetailsHeader = () => {
	return <ATText typography="subheading">Job Details</ATText>;
};

export const Close = ({ isDisabled = false }) => {
	return (
		<TouchableOpacity onPress={() => router.back()} disabled={isDisabled}>
			<Ionicons name="close-outline" size={35}></Ionicons>
		</TouchableOpacity>
	);
};

export default function AuthenticateRootLayout() {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="jobDetailsPage"
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
