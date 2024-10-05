import React from "react";
import { StyleSheet, Image, TouchableOpacity, View, Text, SafeAreaView } from "react-native";
import { Colors, Typography } from "react-native-ui-lib";
import { useRouter } from "expo-router";
import { ATProgressDots } from "@/components/atoms/ProgressDots";
import { ATText } from "@/components/atoms/Text";
import { MLButton } from "@/components/molecules/Button";
import ORCoursel from "@/components/organisms/Coursel";

export default function Onboarding() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.column}>
				<View style={styles.subHeading}>
					<ATText typography="heading">Welcome</ATText>
				</View>
				<Image source={require("../assets/images/Logo.png")} style={styles.image} />
				<ORCoursel />
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
	column: {
		paddingBottom: 253,
	},
	image: {
		maxHeight: 218,
		width: "100%",
		marginVertical: 20,
	},
	subHeading: {
		alignItems: "center",
		paddingTop: 21,
		paddingBottom: 8,
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
});
