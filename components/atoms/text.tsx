import React from "react";
import { Text as RNText, TextStyle } from "react-native";
import { useFonts } from "@/hooks/useFonts";
import { Colors, Typography } from "react-native-ui-lib";

interface CustomTextProps {
	children: React.ReactNode;
	typography?: keyof typeof Typography;
	color?: keyof typeof Colors;
	style?: TextStyle;
}

export const CustomText: React.FC<CustomTextProps> = ({
	children,
	typography = "body",
	color = "primaryTextColor",
	style,
}) => {
	const fontsLoaded = useFonts();

	if (!fontsLoaded) {
		return null;
	}

	const textStyle: TextStyle = {
		...Typography[typography],
		color: Colors[color],
		fontFamily: "Roboto-Regular",
		...style,
	};

	return <RNText style={textStyle}>{children}</RNText>;
};
