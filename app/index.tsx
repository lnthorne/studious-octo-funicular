import React, { useEffect, useRef } from "react";
import { StyleSheet, Image, View, SafeAreaView, Animated } from "react-native";
import { ATText } from "@/components/atoms/Text";
import ORCoursel from "@/components/organisms/Coursel";
import { Colors } from "./design-system/designSystem";

export default function Onboarding() {
	const opacity = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<Animated.View style={[{ flex: 1 }, { opacity }]}>
				<View style={styles.column}>
					<View style={styles.subHeading}>
						<ATText typography="heading">Welcome</ATText>
					</View>
					<Image source={require("../assets/images/SpadeLogo.png")} style={styles.image} />
					<ORCoursel />
				</View>
			</Animated.View>
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
