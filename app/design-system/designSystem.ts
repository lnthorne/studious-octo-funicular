import { Colors, Typography } from "react-native-ui-lib";

Colors.loadColors({
	primaryColor: "#1AE51A", // The green color for buttons and highlights
	secondaryColor: "#E8F2E8", // The yellow color for important elements
	backgroundColor: "#F7FCF7", // The white background color
	textPrimary: "#0D1C0D", // The primary text color (dark gray/black)
	textSecondary: "#4F964F", // Secondary text color (light gray)
	borderColor: "#E5E5EA", // Border color for cards and other elements
	cardBackground: "#F2F2F7", // Background for cards or elevated surfaces
});

Typography.loadTypographies({
	heading: { fontSize: 28, fontWeight: "700", lineHeight: 35, fontStyle: "normal" },
	subheading: { fontSize: 22, fontWeight: "700", lineHeight: 28, fontStyle: "normal" },
	hint: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
	body: { fontSize: 16, fontWeight: "400", lineHeight: 24, fontStyle: "normal" },
	button: { fontSize: 16, fontWeight: "700", lineHeight: 24, fontStyle: "normal" },
});

Colors.loadSchemes({
	light: {
		screenBG: Colors.backgroundColor,
		primaryTextColor: Colors.textPrimary,
		secondayTextColor: Colors.textSecondary,
		primaryButtonBG: Colors.primaryColor,
		secondaryButtonBG: Colors.secondaryColor,
	},
	dark: {
		screenBG: Colors.backgroundColor,
		primaryTextColor: Colors.textPrimary,
		secondayTextColor: Colors.textSecondary,
		primaryButtonBG: Colors.primaryColor,
		secondaryButtonBG: Colors.secondaryColor,
	},
});
