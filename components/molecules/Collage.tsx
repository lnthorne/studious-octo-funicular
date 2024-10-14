import React, { useState } from "react";
import { View, Image, TouchableOpacity, Modal, StyleSheet, ImageStyle } from "react-native";
import { ATText } from "../atoms/Text";

interface CollageProps {
	images: string[] | undefined;
	matrix: number[];
}

export default function MLCollage({ images, matrix }: CollageProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const openImage = (image: string) => {
		setSelectedImage(image);
	};

	const closeImage = () => {
		setSelectedImage(null);
	};

	if (!images || images?.length < 1) {
		return (
			<ATText style={styles.noImage} typography="secondaryText" color="secondaryTextColor">
				No Images...
			</ATText>
		);
	}

	const totalImagesInMatrix = matrix.reduce((sum, num) => sum + num, 0);

	const imagesToDisplay = images.slice(0, totalImagesInMatrix);

	let imageIndex = 0;

	return (
		<View style={styles.collageContainer}>
			{matrix.map((numImagesInRow, rowIndex) => {
				const rowImages = imagesToDisplay.slice(imageIndex, imageIndex + numImagesInRow);
				imageIndex += numImagesInRow;

				return (
					<View key={rowIndex} style={styles.rowContainer}>
						{rowImages.map((image, idx) => (
							<TouchableOpacity key={idx} onPress={() => openImage(image)} style={{ flex: 1 }}>
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

			{selectedImage && (
				<Modal visible={true} transparent={true} onRequestClose={closeImage}>
					<TouchableOpacity style={styles.fullScreen} onPress={closeImage}>
						<Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
					</TouchableOpacity>
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
});
