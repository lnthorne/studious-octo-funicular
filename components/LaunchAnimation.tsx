// LaunchAnimation.tsx
import React, { useRef } from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import { Video, ResizeMode, AVPlaybackSource, AVPlaybackStatus } from "expo-av";
import { Colors } from "@/app/design-system/designSystem";
import { Ionicons } from "@expo/vector-icons";
import { ATText } from "./atoms/Text";

const { width, height } = Dimensions.get("window");

interface AnimationProps {
	onAnimationDone: () => void;
	source: AVPlaybackSource;
	isSkippable?: boolean;
}

const LaunchAnimation = ({ onAnimationDone, source, isSkippable = false }: AnimationProps) => {
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

	const handleSkip = () => {
		console.log("Animation Skipped!");
		onAnimationDone();
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
			{isSkippable && (
				<TouchableOpacity style={styles.overlayIconContainer} onPress={handleSkip}>
					<ATText color="primaryButtonTextColor">Skip</ATText>
				</TouchableOpacity>
			)}
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
	overlayIconContainer: {
		position: "absolute",
		top: 55,
		right: 40,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
});

export default LaunchAnimation;
