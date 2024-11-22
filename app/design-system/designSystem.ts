import { Typography } from "react-native-ui-lib";

export const Colors = {
	primaryButtonColor: "#1F94E0",
	primaryButtonTextColor: "#F7FAFA",
	secondaryButtonColor: "#E8EDF2",
	secondaryButtonTextColor: "#0D171C",
	backgroundColor: "#F7FAFA",
	primaryTextColor: "#0D171C",
	secondaryTextColor: "#4F7A94",
	textBoxBackgroundColor: "#E8EDF2",
	error: "red",
	primaryDotColor: "#1F94E0",
	secondaryDotColor: "#D1DEE5",
	tabBarColor: "#F7FAFA",
	tabBorderTopColor: "#E8EDF2",
	tabIconColor: "#4F7A94",
	timestamp: "#999",
	borderBottomColor: "#ddd",
	shadowColor: "#000",
} as const;

export type ColorKey = keyof typeof Colors;

Typography.loadTypographies({
	heading: { fontSize: 24, fontWeight: "700", lineHeight: 30, fontStyle: "normal" },
	subheading: { fontSize: 18, fontWeight: "700", lineHeight: 23, fontStyle: "normal" },
	buttonText: {
		fontSize: 14,
		fontWeight: "700",
		lineHeight: 21,
		fontStyle: "normal",
		textOveflow: "ellipsis",
	},
	textBoxText: { fontSize: 16, fontWeight: "400", lineHeight: 24, fontStyle: "normal" },
	chipText: { fonSize: 15, fontWeight: "500", lineHeight: 21, fontStyle: "normal" },
	secondaryText: { fontSize: 14, fontWeight: "400", lineHeight: 21, fontStyle: "normal" },
	error: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
	body: { fontSize: 16, fontWeight: "500", lineHeight: 24, fontStyle: "normal" },
	messageText: { fontSize: 15, fontWeight: "400", lineHeight: 18, fontStyle: "normal" },
});
