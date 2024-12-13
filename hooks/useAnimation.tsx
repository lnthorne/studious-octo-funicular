import React, { useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Colors } from "@/app/design-system/designSystem";

const { width, height } = Dimensions.get("window");

interface AnimationProps {
	onAnimationDone: () => void;
}

const LaunchScreen = ({ onAnimationDone }: AnimationProps) => {
	const videoRef = useRef<Video>(null);

	const handlePlaybackStatusUpdate = (status: any) => {
		if (
			status.isLoaded &&
			status.isPlaying === false &&
			status.positionMillis >= status.durationMillis
		) {
			console.log("Animation finished!");
			onAnimationDone();
		}
	};

	return (
		<View style={styles.container}>
			<Video
				ref={videoRef}
				style={styles.video}
				source={require("../assets/splash/splash.mp4")}
				resizeMode={ResizeMode.COVER}
				shouldPlay
				isLooping={false}
				onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.backgroundColor,
	},
	video: {
		width: width,
		height: height,
	},
});

export default LaunchScreen;
