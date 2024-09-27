import "../../app/design-system/designSystem";
import React from "react";
import { Button, View } from "react-native-ui-lib";
import { CustomText } from "../atoms/text";
import { Colors, Typography } from "react-native-ui-lib";
import { StyleSheet } from "react-native";

interface CustomButtonProps {
	label: string;
	onPress: () => void;
	variant?: "primary" | "secondary";
}

export const CustomButton: React.FC<CustomButtonProps> = ({
	label,
	onPress,
	variant = "primary",
}) => {
	const backgroundColor =
		variant === "primary" ? Colors.primaryButtonColor : Colors.secondaryButtonColor;
	const textColor = variant === "primary" ? "primaryButtonTextColor" : "secondaryButtonTextColor";

	return (
		<View>
			<Button onPress={onPress} backgroundColor={backgroundColor} style={styles.ButtonLayout}>
				<CustomText typography="buttonText" color={textColor}>
					{label}
				</CustomText>
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
