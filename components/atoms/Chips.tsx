import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, TouchableOpacity } from "react-native-ui-lib";
import { ATText } from "./Text";

interface ChipProps {
	label: string;
	isToggled: boolean;
	onPress: () => void;
}

const ATChip = ({ label, isToggled, onPress }: ChipProps) => {
	const backgroundColor = isToggled ? Colors.primaryButtonColor : Colors.secondaryButtonColor;
	const textColor = isToggled ? "primaryButtonTextColor" : "secondaryButtonTextColor";
	return (
		<TouchableOpacity backgroundColor={backgroundColor} style={styles.chip} onPress={onPress}>
			<ATText typography="chipText" color={textColor}>
				{label}
			</ATText>
		</TouchableOpacity>
	);
};

export default ATChip;

const styles = StyleSheet.create({
	chip: {
		paddingHorizontal: 8,
		borderRadius: 12,
		height: 38,
		width: 88,
		alignItems: "center",
		justifyContent: "center",
	},
});
