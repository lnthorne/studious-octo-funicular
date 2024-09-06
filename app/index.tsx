import React from "react";
import {
	Button,
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	View,
	Text,
	SafeAreaView,
	Dimensions,
	ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TextField, View, Text } from "react-native-ui-lib";
// import { Colors, Typography } from "react-native-ui-lib";

const { height } = Dimensions.get("window");

export default function Onboarding() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.column}>
				<Image
					source={require("../assets/images/onboarding.png")}
					resizeMode={"stretch"}
					style={styles.image}
				/>
				<Text style={styles.text}>{"Welcome to Yardly"}</Text>
				<Text style={styles.text2}>
					{"Get your yard ready for the season with professional help."}
				</Text>
				<TouchableOpacity style={styles.view} onPress={() => router.push("/userChoice")}>
					<Text style={styles.text3}>{"Let's Go"}</Text>
				</TouchableOpacity>
				<View style={styles.box3}></View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7FCF7",
	},
	box: {
		width: 8,
		height: 8,
		backgroundColor: "#19E519",
		borderRadius: 4,
	},
	box2: {
		width: 8,
		height: 8,
		backgroundColor: "#D1E8D1",
		borderRadius: 4,
	},
	box3: {
		height: 20,
		backgroundColor: "#F7FCF7",
	},
	column: {
		backgroundColor: "#F7FCF7",
		paddingBottom: 253,
	},
	image: {
		height: 320,
		marginBottom: 28,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 32,
		marginHorizontal: 161,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	text: {
		color: "#0C1C0C",
		fontSize: 28,
		marginBottom: 22,
		marginLeft: 17,
	},
	text2: {
		color: "#0C1C0C",
		fontSize: 16,
		marginBottom: 41,
		marginHorizontal: 18,
		width: 354,
	},
	text3: {
		color: "#0C1C0C",
		fontSize: 16,
	},
	view: {
		alignItems: "center",
		backgroundColor: "#19E519",
		borderRadius: 24,
		paddingVertical: 18,
		marginBottom: 12,
		marginHorizontal: 16,
	},
});
