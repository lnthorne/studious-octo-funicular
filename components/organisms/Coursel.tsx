import React, { createRef, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { View, Carousel, PageControl } from "react-native-ui-lib";
import { MLButton } from "../molecules/Button";
import { router } from "expo-router";
import { ATText } from "../atoms/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/app/design-system/designSystem";

const screenWidth = Dimensions.get("window").width;

/**
 * TODO: This is basically just for the index page, either nove this there or make it generic
 */
const ORCoursel: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(0);
	const carouselRef = createRef<typeof Carousel>();

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

	const goToNextPage = () => {
		if (carouselRef.current && currentPage < pages.length - 1) {
			carouselRef.current.goToNextPage();
			setCurrentPage(currentPage + 1);
		}
	};

	const pages = [
		{
			id: 1,
			content: (
				<>
					<ATText typography="heading" style={styles.heading}>
						Home Maintenance Made Easy. Anytime, Anywhere.
					</ATText>
					<ATText typography="body" style={styles.body}>
						Get your home ready for the season with professional help.
					</ATText>
					<View style={styles.buttonFullWidthContainer}>
						<MLButton variant="primary" label="Get Started" onPress={goToNextPage} />
					</View>
				</>
			),
		},
		{
			id: 2,
			content: (
				<>
					<ATText typography="heading" style={styles.heading}>
						Welcome To The Future of Home Maintenance.
					</ATText>
					<ATText typography="body" style={styles.body}>
						Are you a homeowner or a service provider?
					</ATText>
					<View style={styles.buttonContainer}>
						<MLButton
							label="Homeowner"
							variant="primary"
							onPress={handleHomeownerOnboarding}
							style={styles.button}
						/>
						<MLButton
							label="Provider"
							variant="secondary"
							onPress={handleLandscaperOnboarding}
							style={styles.button}
						/>
					</View>
				</>
			),
		},
	];

	return (
		<View flex>
			<View>
				<PageControl
					numOfPages={pages.length}
					currentPage={currentPage}
					size={8}
					color={Colors.primaryDotColor}
					inactiveColor={Colors.secondaryDotColor}
					containerStyle={{ marginBottom: 20 }}
				/>
			</View>

			<Carousel
				ref={carouselRef}
				onChangePage={(page: number) => setCurrentPage(page)}
				pagingEnabled={true}
				containerStyle={{ flexGrow: 1, alignContent: "center" }}
				animated={true}
				initialPage={currentPage}
			>
				{pages.map((page) => (
					<View key={page.id} center padding-20 style={{ alignSelf: "center" }}>
						{page.content}
					</View>
				))}
			</Carousel>
		</View>
	);
};

const styles = StyleSheet.create({
	heading: {
		paddingTop: 20,
		paddingBottom: 8,
		textAlign: "center",
	},
	body: {
		paddingHorizontal: 16,
		paddingTop: 4,
		paddingBottom: 16,
		alignSelf: "center",
		textAlign: "center",
	},
	buttonFullWidthContainer: {
		width: screenWidth,
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

export default ORCoursel;
