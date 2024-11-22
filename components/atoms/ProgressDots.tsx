import { Colors } from "@/app/design-system/designSystem";
import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressDotsProps {
	totalDots: number;
	selectedIndex: number;
	dotSize?: number;
	spacing?: number;
}

export const ATProgressDots: React.FC<ProgressDotsProps> = ({
	totalDots,
	selectedIndex,
	dotSize = 8,
	spacing = 8,
}) => {
	return (
		<View style={[styles.container, { marginHorizontal: spacing / 2 }]}>
			{Array.from({ length: totalDots }).map((_, index) => (
				<View
					key={index}
					style={[
						styles.dot,
						{
							backgroundColor:
								index === selectedIndex ? Colors.primaryDotColor : Colors.secondaryDotColor,
							width: dotSize,
							height: dotSize,
							borderRadius: dotSize / 2,
							marginHorizontal: spacing / 2,
						},
					]}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 20,
	},
	dot: {},
});
