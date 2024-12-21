import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export async function showImagePickerOptions(pickImage: (fromCamera: boolean) => void) {
	Alert.alert(
		"Upload Image",
		"Choose an option",
		[
			{ text: "Take a Photo", onPress: () => pickImage(true) },
			{ text: "Choose from Library", onPress: () => pickImage(false) },
			{ text: "Cancel", style: "cancel" },
		],
		{ cancelable: true }
	);
}

export async function selectProfileImage(fromCamera: boolean): Promise<string | undefined> {
	let permissionResult;
	if (fromCamera) {
		permissionResult = await ImagePicker.requestCameraPermissionsAsync();
	} else {
		permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
	}

	if (permissionResult.status !== "granted") {
		Alert.alert("Sorry, we need permissions to make this work!");
		return;
	}

	let result;
	if (fromCamera) {
		result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			quality: 0.3,
		});
	} else {
		result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.3,
			allowsEditing: true,
			aspect: [4, 3],
		});
	}

	if (!result.canceled) {
		const uri = result.assets[0].uri;
		return uri;
	}
}
