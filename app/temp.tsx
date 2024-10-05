import React, { useRef, useState } from "react";
import { SafeAreaView, View, Image, ScrollView, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import { ATText } from "@/components/atoms/Text";
import { ATProgressDots } from "@/components/atoms/ProgressDots";
import { MLButton } from "@/components/molecules/Button";
import { Colors } from "react-native-ui-lib";

const screenWidth = Dimensions.get("window").width;

export default function CarouselScreen() {
	const scrollViewRef = useRef<ScrollView>(null);
	const [currentIndex, setCurrentIndex] = useState(0); // Track current slide index

	const handleNextSlide = () => {
		if (currentIndex < 1) {
			setCurrentIndex((prevIndex) => prevIndex + 1);
			scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * screenWidth, animated: true }); // Scroll to the next slide
		}
	};

	const handleHomeownerOnboarding = () => {
		router.push("/companyowner/signIn"); // Handle navigation for homeowner
	};

	const handleLandscaperOnboarding = () => {
		router.navigate("/homeowner/signIn"); // Handle navigation for landscaper
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Fixed Heading and Image */}
			<View style={styles.column}>
				<View style={styles.subHeading}>
					<ATText typography="heading">Welcome</ATText>
				</View>
				<Image source={require("../assets/images/Logo.png")} style={styles.image} />
			</View>

			<ScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				scrollEnabled={false}
				showsHorizontalScrollIndicator={false}
				style={styles.carousel}
			>
				<View style={styles.carouselContent}>
					<ATText typography="heading" style={styles.heading}>
						Get your price. Schedule and pay.
					</ATText>
					<ATText typography="body" style={styles.body}>
						Get your yard ready for the season with professional help.
					</ATText>
					<ATProgressDots totalDots={3} selectedIndex={currentIndex} />
					<MLButton variant="primary" label="Get Started" onPress={handleNextSlide} />
				</View>

				<View style={styles.carouselContent}>
					<ATText typography="heading" style={styles.heading}>
						Welcome to the future of landscaping.
					</ATText>
					<ATText typography="body" style={styles.body}>
						Are you a homeowner or a landscaper?
					</ATText>
					<ATProgressDots totalDots={3} selectedIndex={currentIndex} />
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
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		width: "100%",
		borderColor: "red",
		borderWidth: 2,
	},
	column: {
		borderColor: "blue",
		borderWidth: 2,
	},
	image: {
		maxHeight: 218,
		width: "100%",
		marginVertical: 20,
		borderBlockColor: "red",
		borderWidth: 2,
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
		borderColor: "red",
		borderWidth: 2,
	},
	carousel: {
		flex: 1, // Let the content below the image take up the rest of the space
		borderColor: "red",
		borderWidth: 2,
	},
	carouselContent: {
		width: screenWidth, // Set width to the screen width dynamically
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
		borderColor: "red",
		borderWidth: 2,
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
		borderColor: "red",
		borderWidth: 2,
	},
	button: {
		width: 175,
		minWidth: 84,
		maxWidth: 480,
		paddingHorizontal: 10,
		marginHorizontal: 0,
	},
});
