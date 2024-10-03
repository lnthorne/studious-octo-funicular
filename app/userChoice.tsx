import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SafeAreaView, View, Image, Text, StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";
import { ATText } from "@/components/atoms/Text";
import { ATProgressDots } from "@/components/atoms/ProgressDots";
import { MLButton } from "@/components/molecules/Button";

export default function UserChoice() {
	const handleLandscaperOnboarding = async () => {
		await AsyncStorage.setItem("hasOnboarded", "true");
		await AsyncStorage.setItem("userType", "companyowner");
		router.push("/companyowner/signIn");
	};

	const handleHomeownerOnboarding = async () => {
		await AsyncStorage.setItem("hasOnboarded", "true");
		await AsyncStorage.setItem("userType", "homeowner");
		router.push("/homeowner/signIn");
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.subHeading}>
				<ATText typography="subheading">Welcome to Yardly</ATText>
			</View>
			<Image source={require("../assets/images/decision.png")} style={styles.image} />
			<ATText typography="heading" style={styles.heading}>
				Welcome to the future of landscaping.
			</ATText>
			<ATText typography="body" style={styles.body}>
				Are you a homeowner or a landscaper?
			</ATText>
			<ATProgressDots totalDots={3} selectedIndex={1} />
			<View style={styles.buttonContainer}>
				<MLButton
					label="Homeowner"
					variant="primary"
					onPress={handleHomeownerOnboarding}
					style={styles.button}
				/>
				<MLButton
					label="Landscaper"
					variant="secondary"
					onPress={handleLandscaperOnboarding}
					style={styles.button}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		width: "100%",
	},
	subHeading: {
		alignItems: "center",
		paddingTop: 21,
		paddingBottom: 8,
	},
	image: {
		maxHeight: 218,
		width: "100%",
	},
	heading: {
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 8,
		alignSelf: "center",
		textAlign: "center",
	},
	body: {
		paddingHorizontal: 16,
		paddingTop: 4,
		paddingBottom: 16,
		alignSelf: "center",
		textAlign: "center",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-start",
		alignSelf: "stretch",
		paddingHorizontal: 12,
		paddingVertical: 12,
		gap: 12,
	},
	button: {
		width: 175,
		minWidth: 84,
		maxWidth: 480,
		paddingHorizontal: 10,
		marginHorizontal: 0,
	},
});
