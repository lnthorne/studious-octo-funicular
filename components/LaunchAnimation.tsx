// LaunchAnimation.tsx
import React, { useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Video, ResizeMode, AVPlaybackSource, AVPlaybackStatus } from "expo-av";
import { Colors } from "@/app/design-system/designSystem";

const { width, height } = Dimensions.get("window");

interface AnimationProps {
	onAnimationDone: () => void;
	source: AVPlaybackSource;
}

const LaunchAnimation = ({ onAnimationDone, source }: AnimationProps) => {
	const videoRef = useRef<Video>(null);

	const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
		if (
			status.isLoaded &&
			!status.isPlaying &&
			status.positionMillis >= (status.durationMillis ?? 0)
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
				source={source}
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
		position: "absolute", // Make sure it overlays everything
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.backgroundColor,
		zIndex: 9999,
	},
	video: {
		width: width,
		height: height,
	},
});

export default LaunchAnimation;
