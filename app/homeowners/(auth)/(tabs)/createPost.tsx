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
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { CreateNewPost } from "@/services/post";
import * as ImagePicker from "expo-image-picker";
import { IPost, JobStatus } from "@/typings/jobs.inter";
import { getUser } from "@/services/user";
import { IHomeOwnerEntity, UserType } from "@/typings/user.inter";
import { router } from "expo-router";

const PostSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	description: Yup.string().required("Description is required"),
});

export default function CreatePostScreen() {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [userData, setUserData] = useState<IHomeOwnerEntity | null>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			// TODO: THIS IS BAD YOU NEED TO CREATE A CONTEXT TO GET THE USER
			const fetchUser = async () => {
				setLoading(true);
				try {
					const user = await getUser<IHomeOwnerEntity>(UserType.homeowner);
					if (!user) {
						return;
					}
					setUserData(user);
				} catch (error) {
					console.error("Error fetching user data", error);
				} finally {
					setLoading(false);
				}
			};
			fetchUser();
		} catch (error) {
			console.error("Error fetching user data", error);
		}
	}, []);

	const handlePostSubmit = async (values: IPost) => {
		console.log("Values: ", values);
		setLoading(true);
		try {
			const postWithUid: IPost = {
				...values,
				uid: userData!.uid,
			};
			await CreateNewPost(postWithUid, imageUri);
			// Optionally navigate back or show a success message
		} catch (error) {
			console.error("Error creating post: ", error);
		} finally {
			setLoading(false);
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
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
		}

		if (!result.canceled) {
			setImageUri(result.assets[0].uri);
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
		<View style={styles.container}>
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
							numberOfLines={5} // Adjust this to make the text area bigger
						/>
						{errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

						<Button title="Pick an image" onPress={showImagePickerOptions} />
						{imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}

						{loading ? (
							<ActivityIndicator size="small" color="#0000ff" />
						) : (
							<Button title="Create Post" onPress={handleSubmit as () => void} />
						)}
					</View>
				)}
			</Formik>
		</View>
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
	errorText: {
		color: "red",
		marginBottom: 10,
	},
});
