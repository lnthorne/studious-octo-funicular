import { StyleSheet, View } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";
import { ATText } from "./atoms/Text";
import { Colors } from "@/app/design-system/designSystem";

interface ReviewStatsProps {
	totalReviews: number | undefined;
	averageRating: number | undefined;
	ratingPercentages: number[] | undefined;
}

export default function ReviewStats({
	totalReviews,
	averageRating,
	ratingPercentages,
}: ReviewStatsProps) {
	return (
		<View style={styles.container}>
			<View style={styles.ratingContainer}>
				<ATText typography="heading" style={{ fontSize: 30 }}>
					{averageRating?.toFixed(1)}
				</ATText>
				<View style={styles.starContainer}>
					{[1, 2, 3, 4, 5].map((star, idx) => (
						<Ionicons
							key={idx}
							name={star <= Math.round(averageRating ?? 0) ? "star" : "star-outline"}
							size={20}
							color={Colors.primaryButtonColor}
						/>
					))}
				</View>
				<ATText typography="textBoxText">{`${totalReviews} reviews`}</ATText>
			</View>
			<View style={styles.ratingContainer}>
				{ratingPercentages?.map((percentage, index) => (
					<View style={styles.progressBarConatiner}>
						<ATText>{index + 1}</ATText>
						<Progress.Bar
							progress={percentage || 0}
							width={200}
							animationType="decay"
							color={Colors.primaryButtonColor}
							style={styles.progressBar}
							height={8}
							animated
							animationConfig={{ bounciness: 20 }}
						/>
						<ATText typography="textSecondary" color="secondaryTextColor">{`${
							percentage * 100
						}%`}</ATText>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "center",
		paddingVertical: 16,
	},
	ratingContainer: {
		flexDirection: "column",
	},
	starContainer: {
		flexDirection: "row",
		paddingVertical: 15,
	},
	progressBarConatiner: {
		flexDirection: "row",
		alignContent: "center",
		alignItems: "center",
		gap: 5,
		marginBottom: 12,
	},
	progressBar: {},
});
