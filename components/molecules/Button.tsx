import "../../app/design-system/designSystem";
import React from "react";
import { Button, View } from "react-native-ui-lib";
import { ATText } from "../atoms/Text";
import { Colors } from "react-native-ui-lib";
import { StyleSheet } from "react-native";

interface CustomButtonProps {
	label: string;
	onPress: () => void;
	variant?: "primary" | "secondary";
}

export const MLButton: React.FC<CustomButtonProps> = ({ label, onPress, variant = "primary" }) => {
	const backgroundColor =
		variant === "primary" ? Colors.primaryButtonColor : Colors.secondaryButtonColor;
	const textColor = variant === "primary" ? "primaryButtonTextColor" : "secondaryButtonTextColor";

	return (
		<View>
			<Button onPress={onPress} backgroundColor={backgroundColor} style={styles.ButtonLayout}>
				<ATText typography="buttonText" color={textColor}>
					{label}
				</ATText>
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	ButtonLayout: {
		alignItems: "center",
		borderRadius: 12,
		paddingVertical: 21,
		marginBottom: 12,
		marginHorizontal: 16,
	},
});
