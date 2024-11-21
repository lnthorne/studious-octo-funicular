import React from "react";
import { Text as RNText, TextStyle } from "react-native";
import { Colors, Typography } from "react-native-ui-lib";

interface CustomTextProps {
	children: React.ReactNode;
	typography?: keyof typeof Typography | string;
	color?: keyof typeof Colors | string;
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
