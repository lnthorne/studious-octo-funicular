import React, { useState } from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Modal,
	StyleSheet,
	ImageStyle,
	Alert,
	TouchableWithoutFeedback,
} from "react-native";
import { ATText } from "../atoms/Text";
import { Ionicons } from "@expo/vector-icons";

interface CollageProps {
	images: string[] | undefined;
	matrix: number[];
	onLongPress?: (selectedImage: string) => void;
}

export default function MLCollage({ images, matrix, onLongPress }: CollageProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

	const openImage = (index: number) => {
		setSelectedImageIndex(index);
	};

	const closeImage = () => {
		setSelectedImageIndex(null);
	};

	if (!images || images?.length < 1) {
		return (
			<ATText style={styles.noImage} typography="secondaryText" color="secondaryTextColor">
				No Images...
			</ATText>
		);
	}

	const goToNextImage = () => {
		if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
			setSelectedImageIndex(selectedImageIndex + 1);
		}
	};

	const goToPreviousImage = () => {
		if (selectedImageIndex !== null && selectedImageIndex > 0) {
			setSelectedImageIndex(selectedImageIndex - 1);
		}
	};

	const totalImagesInMatrix = matrix.reduce((sum, num) => sum + num, 0);

	const imagesToDisplay = images.slice(0, totalImagesInMatrix);

	let imageIndex = 0;

	return (
		<View style={styles.collageContainer}>
			{matrix.map((numImagesInRow, rowIndex) => {
				const rowImages = imagesToDisplay.slice(imageIndex, imageIndex + numImagesInRow);
				const currentRowStartIndex = imageIndex;
				imageIndex += numImagesInRow;
				// console.log("Image index", imageIndex);

				return (
					<View key={rowIndex} style={styles.rowContainer}>
						{rowImages.map((image, idx) => (
							<TouchableOpacity
								key={idx}
								onPress={() => openImage(currentRowStartIndex + idx)}
								onLongPress={() => onLongPress?.(image)}
								style={{ flex: 1 }}
							>
								<Image
									source={{ uri: image }}
									style={[
										styles.image,
										getImageStyle(rowIndex, idx, numImagesInRow, matrix.length),
									]}
								/>
							</TouchableOpacity>
						))}
					</View>
				);
			})}

			{selectedImageIndex !== null && (
				<Modal animationType="fade" visible={true} transparent={true} onRequestClose={closeImage}>
					<View style={styles.fullScreen}>
						<TouchableWithoutFeedback onPress={closeImage}>
							<Image source={{ uri: images[selectedImageIndex] }} style={styles.fullScreenImage} />
						</TouchableWithoutFeedback>

						{selectedImageIndex > 0 && (
							<TouchableOpacity onPress={goToPreviousImage} style={styles.prevButton}>
								<Ionicons name="chevron-back" size={32} color={"white"} />
							</TouchableOpacity>
						)}

						{selectedImageIndex < images.length - 1 && (
							<TouchableOpacity onPress={goToNextImage} style={styles.nextButton}>
								<Ionicons name="chevron-forward" size={32} color={"white"} />
							</TouchableOpacity>
						)}
					</View>
				</Modal>
			)}
		</View>
	);
}

const getImageStyle = (
	rowIndex: number,
	idx: number,
	numImagesInRow: number,
	totalRows: number
) => {
	const style: ImageStyle = {};

	if (rowIndex === 0) {
		if (idx === 0) {
			style.borderTopLeftRadius = 15;
		}
		if (idx === numImagesInRow - 1) {
			style.borderTopRightRadius = 15;
		}
	}
	if (rowIndex === totalRows - 1) {
		if (idx === 0) {
			style.borderBottomLeftRadius = 15;
		}
		if (idx === numImagesInRow - 1) {
			style.borderBottomRightRadius = 15;
		}
	}

	return style;
};

const styles = StyleSheet.create({
	collageContainer: {
		height: 360,
		borderRadius: 15,
		overflow: "hidden",
		alignSelf: "stretch",
	},
	rowContainer: {
		flexDirection: "row",
		flex: 1,
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		margin: 3,
	},
	fullScreen: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.9)",
		justifyContent: "center",
		alignItems: "center",
	},
	fullScreenImage: {
		width: "100%",
		height: "100%",
		resizeMode: "contain",
	},
	noImage: {
		alignSelf: "center",
		marginVertical: 15,
	},
	prevButton: {
		position: "absolute",
		left: 10,
		padding: 10,
		borderRadius: 16,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	nextButton: {
		position: "absolute",
		right: 10,
		padding: 10,
		borderRadius: 16,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
});
