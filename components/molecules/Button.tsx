import "../../app/design-system/designSystem";
import React from "react";
import { Button, View } from "react-native-ui-lib";
import { ATText } from "../atoms/Text";
import { Colors } from "react-native-ui-lib";
import { ButtonProps, ViewStyle } from "react-native";

interface CustomButtonProps extends Omit<ButtonProps, "title"> {
	label: string;
	onPress: () => void;
	variant?: "primary" | "secondary";
	style?: ViewStyle;
}

export const MLButton: React.FC<CustomButtonProps> = ({
	label,
	onPress,
	variant = "primary",
	style,
	disabled = false,
}) => {
	const backgroundColor =
		variant === "primary" ? Colors.primaryButtonColor : Colors.secondaryButtonColor;
	const textColor = variant === "primary" ? "primaryButtonTextColor" : "secondaryButtonTextColor";

	const buttonStyle: ViewStyle = {
		alignItems: "center",
		borderRadius: 12,
		paddingVertical: 21,
		marginVertical: 12,
		marginHorizontal: 16,
		...style,
	};

	return (
		<View>
			<Button
				disabled={disabled}
				onPress={onPress}
				backgroundColor={backgroundColor}
				style={buttonStyle}
			>
				<ATText typography="buttonText" color={textColor}>
					{label}
				</ATText>
			</Button>
		</View>
	);
};
