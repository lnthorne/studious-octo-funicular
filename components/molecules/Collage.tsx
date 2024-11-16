import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Modal,
	StyleSheet,
	ImageStyle,
	TouchableWithoutFeedback,
	ActivityIndicator,
	Animated,
} from "react-native";
import { ATText } from "../atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native-ui-lib";

interface CollageProps {
	images: string[];
	matrix: number[];
	onLongPress?: (selectedImage: number) => void;
}

export default function MLCollage({ images, matrix, onLongPress }: CollageProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [imageOpacities, setImageOpacities] = useState<Animated.Value[]>([]);
	const [imagesLoading, setImagesLoading] = useState(true);
	const [modalLoading, setModalLoading] = useState(true);

	const handleModalLoaded = () => {
		setModalLoading(false);
	};

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

	useEffect(() => {
		const newImageOpacities = imagesToDisplay.map(
			(_, index) => imageOpacities[index] || new Animated.Value(0)
		);
		setImageOpacities(newImageOpacities);
	}, [images]);

	return (
		<View style={styles.collageContainer}>
			{imagesLoading && (
				<ActivityIndicator
					style={styles.loadingIndicator}
					size="large"
					color={Colors.primaryButtonColor}
				/>
			)}
			{matrix.map((numImagesInRow, rowIndex) => {
				const rowImages = imagesToDisplay.slice(imageIndex, imageIndex + numImagesInRow);
				const currentRowStartIndex = imageIndex;
				imageIndex += numImagesInRow;

				return (
					<View key={rowIndex} style={styles.rowContainer}>
						{rowImages.map((image, idx) => {
							const absoluteIndex = currentRowStartIndex + idx;
							const imageOpacity = imageOpacities[absoluteIndex];

							const handleImageLoad = () => {
								Animated.timing(imageOpacity, {
									toValue: 1,
									duration: 500,
									useNativeDriver: true,
								}).start();
								setImagesLoading(false);
							};

							return (
								<TouchableOpacity
									key={idx}
									onPress={() => openImage(absoluteIndex)}
									onLongPress={() => onLongPress?.(absoluteIndex)}
									style={{ flex: 1 }}
								>
									<Animated.Image
										source={{ uri: image }}
										style={[
											styles.image,
											getImageStyle(rowIndex, idx, numImagesInRow, matrix.length),
											{ opacity: imageOpacity }, // Apply animated opacity
										]}
										onLoadEnd={handleImageLoad}
									/>
								</TouchableOpacity>
							);
						})}
					</View>
				);
			})}

			{selectedImageIndex !== null && (
				<Modal animationType="fade" visible={true} transparent={true} onRequestClose={closeImage}>
					<View style={styles.fullScreen}>
						{modalLoading && (
							<ActivityIndicator
								size="large"
								color={Colors.backgroundColor}
								style={styles.modalLoadingIndicator}
							/>
						)}
						<TouchableWithoutFeedback onPress={closeImage}>
							<Image
								source={{ uri: images[selectedImageIndex] }}
								style={styles.fullScreenImage}
								onLoadEnd={handleModalLoaded}
								onLoadStart={() => setModalLoading(true)}
							/>
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
		position: "relative",
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
	loadingIndicator: {
		position: "absolute",
		top: "50%",
		left: "50%",
		marginLeft: -12, // Center the spinner
		marginTop: -12,
		zIndex: 1, // Ensure it overlays the images
	},
	modalLoadingIndicator: {
		position: "absolute", // Positioned on top of the image
		zIndex: 1,
	},
});
