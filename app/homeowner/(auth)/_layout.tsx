import { ATText } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native-ui-lib";

const JobDetailsHeader = () => {
	return <ATText typography="subheading">Job Details</ATText>;
};

const BidDetailsHeader = () => {
	return <ATText typography="subheading">Bid Details</ATText>;
};

export const Close = ({ isDisabled = false }) => {
	return (
		<TouchableOpacity onPress={() => router.back()} disabled={isDisabled}>
			<Ionicons name="close-outline" size={35}></Ionicons>
		</TouchableOpacity>
	);
};

const Back = () => {
	return (
		<TouchableOpacity onPress={() => router.back()}>
			<Ionicons name="arrow-back-outline" size={35}></Ionicons>
		</TouchableOpacity>
	);
};

export default function AuthenticateRootLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(tabs)" />
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
			<Stack.Screen
				name="bidDetailsPage"
				options={{
					headerShown: true,
					headerTransparent: true,
					headerTitle: () => <BidDetailsHeader />,
					headerLeft: () => <Back />,
					headerBackVisible: false,
				}}
			/>
		</Stack>
	);
}
