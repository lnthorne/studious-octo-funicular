import React from "react";
import { Button } from "react-native-ui-lib";
import { CustomText } from "../atoms/text";
import { Colors, Typography } from "react-native-ui-lib";

interface CustomButtonProps {
	label: string;
	onPress: () => void;
	variant?: "primary" | "secondary"; // To allow for different button styles
}

export const CustomButton: React.FC<CustomButtonProps> = ({
	label,
	onPress,
	variant = "primary", // Default to primary button
}) => {
	const backgroundColor =
		variant === "primary" ? Colors.primaryButtonColor : Colors.secondaryButtonColor;
	const textColor =
		variant === "primary" ? Colors.primaryButtonTextColor : Colors.secondaryButtonTextColor;

	return (
		<Button
			onPress={onPress}
			style={{
				backgroundColor: Colors.secondaryButtonColor,
				borderRadius: 8,
				paddingVertical: 12,
				paddingHorizontal: 24,
			}}
		>
			<CustomText typography="buttonText" color={textColor}>
				{label}
			</CustomText>
		</Button>
	);
};
