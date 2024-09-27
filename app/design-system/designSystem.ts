import { Colors, Typography } from "react-native-ui-lib";

Colors.loadColors({
	primaryButtonColor: "#1F94E0",
	primaryButtonTextColor: "#F7FAFA",
	secondaryButtonColor: "#E8EDF2",
	secondaryButtonTextColor: "#0D171C",
	backgroundColor: "#F7FAFA",
	primaryTextColor: "#0D171C",
	secondaryTextColor: "#4F7A94",
	textBoxBackgroundColor: "#E8EDF2",
});

Typography.loadTypographies({
	heading: { fontSize: 24, fontWeight: "700", lineHeight: 30, fontStyle: "normal" },
	subheading: { fontSize: 26, fontWeight: "400", lineHeight: 24, fontStyle: "normal" },
	buttonText: { fontSize: 16, fontWeight: "700", lineHeight: 24, fontStyle: "normal" },
	textBoxText: { fontSize: 16, fontWeight: "500", lineHeight: 24, fontStyle: "normal" },
	secondaryText: { fontSize: 14, fontWeight: "400", lineHeight: 21, fontStyle: "normal" },
	error: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
	body: { fontSize: 16, fontWeight: "500", lineHeight: 24, fontStyle: "normal" },
});

Colors.loadSchemes({
	light: {
		screenBG: Colors.backgroundColor,
		primaryTextColor: Colors.primaryTextColor,
		secondayTextColor: Colors.secondaryTextColor,
		primaryButtonBG: Colors.primaryButtonColor,
		secondaryButtonBG: Colors.secondaryButtonColor,
	},
	dark: {
		screenBG: Colors.backgroundColor,
		primaryTextColor: Colors.textPrimary,
		secondayTextColor: Colors.textSecondary,
		primaryButtonBG: Colors.primaryColor,
		secondaryButtonBG: Colors.secondaryColor,
	},
});
