import "../../app/design-system/designSystem";
import React from "react";
import { Button, View } from "react-native-ui-lib";
import { ATText } from "../atoms/Text";
import { Colors } from "react-native-ui-lib";
import { TextStyle } from "react-native";

interface CustomButtonProps {
	label: string;
	onPress: () => void;
	variant?: "primary" | "secondary";
	style?: TextStyle;
}

export const MLButton: React.FC<CustomButtonProps> = ({
	label,
	onPress,
	variant = "primary",
	style,
}) => {
	const backgroundColor =
		variant === "primary" ? Colors.primaryButtonColor : Colors.secondaryButtonColor;
	const textColor = variant === "primary" ? "primaryButtonTextColor" : "secondaryButtonTextColor";

	const textStyle: TextStyle = {
		alignItems: "center",
		borderRadius: 12,
		paddingVertical: 21,
		marginBottom: 12,
		marginHorizontal: 16,
		...style,
	};

	return (
		<View>
			<Button onPress={onPress} backgroundColor={backgroundColor} style={textStyle}>
				<ATText typography="buttonText" color={textColor}>
					{label}
				</ATText>
			</Button>
		</View>
	);
};
