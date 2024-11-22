import { ColorKey, Colors } from "@/app/design-system/designSystem";
import React from "react";
import { Text as RNText, TextStyle } from "react-native";
import { Typography } from "react-native-ui-lib";

interface CustomTextProps {
	children: React.ReactNode;
	typography?: keyof typeof Typography | string;
	color?: ColorKey;
	style?: TextStyle;
}

export const ATText: React.FC<CustomTextProps> = ({
	children,
	typography = "body",
	color = "primaryTextColor",
	style,
}) => {
	const textStyle: TextStyle = {
		...Typography[typography],
		color: Colors[color],
		...style,
	};

	return <RNText style={textStyle}>{children}</RNText>;
};
