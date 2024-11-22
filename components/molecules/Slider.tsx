import { StyleSheet, View } from "react-native";
import React from "react";
import { ATText } from "../atoms/Text";
import { Incubator } from "react-native-ui-lib";
import { Colors } from "@/app/design-system/designSystem";

interface SliderProps {
	radius: number;
	onRadiusChange: (value: number) => void;
}

export default function MLSlider({ radius, onRadiusChange }: SliderProps) {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<ATText>Search Radius (Miles)</ATText>
				<ATText typography="secondaryText">{radius}</ATText>
			</View>
			<Incubator.Slider
				minimumValue={1}
				maximumValue={50}
				step={1}
				value={radius}
				onValueChange={onRadiusChange}
				minimumTrackTintColor={Colors.primaryButtonColor}
				maximumTrackTintColor={Colors.secondaryDotColor}
				thumbTintColor={Colors.primaryButtonColor}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	slider: {
		width: "100%",
	},
});
