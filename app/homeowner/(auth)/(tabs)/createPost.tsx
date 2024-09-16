// app/home/createPost.tsx
import React, { useEffect, useState } from "react";
import {
	View,
	TextInput,
	Button,
	Text,
	Image,
	StyleSheet,
	Alert,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CreateNewPost } from "@/services/post";
import * as ImagePicker from "expo-image-picker";
import { IPost } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { router } from "expo-router";
import { useUser } from "@/contexts/userContext";

const PostSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	description: Yup.string().required("Description is required"),
});

export default function CreatePostScreen() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [imageUris, setImageUris] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handlePostSubmit = async (values: IPost, { resetForm }: FormikHelpers<IPost>) => {
		setLoading(true);
		try {
			const postWithUid: IPost = {
				...values,
				uid: user!.uid,
			};
			await CreateNewPost(postWithUid, imageUris);
		} catch (error) {
			console.error("Error creating post: ", error);
		} finally {
			setLoading(false);
			resetForm();
			router.back();
		}
	};

	const pickImage = async (fromCamera: boolean) => {
		// Request permission to access media library or camera
		let permissionResult;
		if (fromCamera) {
			permissionResult = await ImagePicker.requestCameraPermissionsAsync();
		} else {
			permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		}

		if (permissionResult.status !== "granted") {
			alert("Sorry, we need permissions to make this work!");
			return;
		}

		let result;
		if (fromCamera) {
			result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
		} else {
			result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				aspect: [4, 3],
				quality: 1,
				allowsMultipleSelection: true,
			});
		}

		if (!result.canceled) {
			const uris = result.assets.map((asset) => asset.uri);
			setImageUris([...imageUris, ...uris]);
		}
	};

	const showImagePickerOptions = () => {
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
	};

	const initialValues: IPost = {
		uid: "",
		description: "",
		title: "",
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior for keyboard appearance
				keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0} // Adjust if needed
			>
				<View>
					<Formik
						initialValues={initialValues}
						validationSchema={PostSchema}
						onSubmit={handlePostSubmit}
					>
						{({ handleChange, handleBlur, handleSubmit, values, errors }) => (
							<View>
								<TextInput
									style={styles.input}
									placeholder="Title"
									onChangeText={handleChange("title")}
									onBlur={handleBlur("title")}
									value={values.title}
								/>
								{errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
								<TextInput
									style={[styles.input, styles.textArea]}
									placeholder="Enter description"
									onChangeText={handleChange("description")}
									onBlur={handleBlur("description")}
									value={values.description}
									multiline={true}
									numberOfLines={5}
								/>
								{errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

								<Button title="Pick an image" onPress={showImagePickerOptions} />
								{imageUris.length > 0 && (
									<View style={styles.imageContainer}>
										{imageUris.map((uri, index) => (
											<Image
												key={index}
												source={{ uri }}
												style={{ width: 100, height: 100, margin: 5 }}
											/>
										))}
									</View>
								)}

								{loading ? (
									<ActivityIndicator size="small" color="#0000ff" />
								) : (
									<Button title="Create Post" onPress={handleSubmit as () => void} />
								)}
							</View>
						)}
					</Formik>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 8,
		marginBottom: 10,
		borderRadius: 4,
	},
	textArea: {
		height: 120, // Adjust this to make the text area bigger
		textAlignVertical: "top", // Ensure the text starts at the top of the text area
	},
	imageContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 10,
	},
	errorText: {
		color: "red",
		marginBottom: 10,
	},
});
