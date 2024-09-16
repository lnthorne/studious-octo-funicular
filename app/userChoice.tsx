import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, View, Image, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
			<View style={styles.column}>
				<View style={styles.view}>
					<TouchableOpacity onPress={() => router.back()}>
						<Image
							source={require("../assets/images/back-icon.png")}
							resizeMode={"stretch"}
							style={styles.image}
						/>
					</TouchableOpacity>
				</View>
				<Text style={styles.text}>{"What kind of profile would you like to create?"}</Text>
				<Text style={styles.text2}>
					{"You can be both a homeowner and a landscaper with the same account."}
				</Text>
				<TouchableOpacity style={styles.view2} onPress={handleHomeownerOnboarding}>
					<Text style={styles.text3}>{"Homeowner"}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.view3} onPress={handleLandscaperOnboarding}>
					<Text style={styles.text3}>{"Landscaper"}</Text>
				</TouchableOpacity>
				<View style={styles.box}></View>
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
		height: 20,
		backgroundColor: "#F7FCF7",
	},
	column: {
		backgroundColor: "#F7FCF7",
		paddingBottom: 469,
	},
	image: {
		width: 24,
		height: 24,
		marginTop: 28,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	text: {
		color: "#0C1C0C",
		fontSize: 22,
		marginBottom: 27,
		marginHorizontal: 17,
		width: 356,
	},
	text2: {
		color: "#0C1C0C",
		fontSize: 16,
		marginBottom: 33,
		marginHorizontal: 17,
		width: 356,
	},
	text3: {
		color: "#0C1C0C",
		fontSize: 16,
	},
	view: {
		backgroundColor: "#F7FCF7",
		paddingHorizontal: 16,
		marginBottom: 27,
	},
	view2: {
		alignItems: "center",
		backgroundColor: "#19E519",
		borderRadius: 24,
		paddingVertical: 20,
		marginBottom: 12,
		marginHorizontal: 16,
	},
	view3: {
		alignItems: "center",
		backgroundColor: "#E8F2E8",
		borderRadius: 24,
		paddingVertical: 19,
		marginBottom: 12,
		marginHorizontal: 16,
	},
});
