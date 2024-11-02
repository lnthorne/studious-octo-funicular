import * as ImageManipulator from "expo-image-manipulator";

/**
 * Compresses and converts an image to WEBP format.
 * @param uri - The URI of the image to compress and convert.
 * @param quality - The quality of compression (0 to 1). Default is 0.6.
 * @param width - The maximum width to resize the image. Default is 1080px.
 * @returns The URI of the compressed WEBP image.
 */
async function compressImageToWebP(
	uri: string,
	quality: number = 0.5,
	width: number = 1080
): Promise<string | null> {
	try {
		const manipulatedImage = await ImageManipulator.manipulateAsync(
			uri,
			[{ resize: { width } }], // Resize to the specified width
			{ compress: quality, format: ImageManipulator.SaveFormat.WEBP }
		);

		return manipulatedImage.uri;
	} catch (error) {
		console.error("Error compressing image:", error);
		return null;
	}
}

export default compressImageToWebP;
