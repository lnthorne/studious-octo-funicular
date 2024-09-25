import * as Font from "expo-font";
import { useState, useEffect } from "react";

export const useFonts = () => {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		async function loadFonts() {
			await Font.loadAsync({
				regular: require("../assets/fonts/Manrope-Regular.ttf"),
				bold: require("../assets/fonts/Manrope-Bold.ttf"),
			});
			setFontsLoaded(true);
		}
		loadFonts();
	}, []);

	return fontsLoaded;
};
