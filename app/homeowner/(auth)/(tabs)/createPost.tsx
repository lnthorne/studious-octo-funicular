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
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CreateNewPost } from "@/services/post";
import * as ImagePicker from "expo-image-picker";
import { IPost } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { router } from "expo-router";
import { useUser } from "@/contexts/userContext";
import ORDatePickerModal from "@/components/DatePickerModal";
import { MLButton } from "@/components/molecules/Button";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "react-native-ui-lib";
import { MLTextBox } from "@/components/molecules/TextBox";
import { Ionicons } from "@expo/vector-icons";
import MLCollage from "@/components/molecules/Collage";

const PostSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	description: Yup.string().required("Description is required"),
	zipcode: Yup.string()
		.length(6, "Please enter valid postal code")
		.required("Postal code is required"),
});

const matrixLayout = [[], [1], [1, 1], [2, 1], [2, 2], [3, 2], [2, 3, 1]];

export default function CreatePostScreen() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [imageUris, setImageUris] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

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

	const handleModalClose = () => {
		setModalVisible(false);
	};

	const initialValues: IPost = {
		uid: "",
		description: "",
		title: "",
		estimatedStartDate: new Date(),
		budget: 0,
		zipcode: user?.zipcode || "",
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={{ marginTop: 40 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior for keyboard appearance
				keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // Adjust if needed
			>
				<ScrollView>
					<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
						<Formik
							initialValues={initialValues}
							validationSchema={PostSchema}
							onSubmit={handlePostSubmit}
						>
							{({
								handleChange,
								handleBlur,
								handleSubmit,
								values,
								errors,
								setFieldValue,
								touched,
							}) => (
								<View>
									<MLTextBox
										onChangeText={handleChange("title")}
										onBlur={handleBlur("title")}
										placeholder="Title"
										heading="Title"
										value={values.title}
										errorText={touched.title && errors.title ? errors.title : undefined}
									/>
									<MLTextBox
										onChangeText={handleChange("description")}
										onBlur={handleBlur("description")}
										heading="Description"
										value={values.description}
										errorText={
											touched.description && errors.description ? errors.description : undefined
										}
										multiline={true}
										numberOfLines={5}
									/>
									<MLTextBox
										onChangeText={handleChange("zipcode")}
										onBlur={handleBlur("zipcode")}
										placeholder="Postal code"
										heading="Postal code"
										value={values.zipcode}
										errorText={touched.zipcode && errors.zipcode ? errors.zipcode : undefined}
									/>
									<MLTextBox
										onChangeText={(budget) => {
											const numericValue = budget.replace(/[^0-9.]/g, "");
											setFieldValue("budget", numericValue);
										}}
										onBlur={handleBlur("budget")}
										placeholder="Budget"
										heading="Budget"
										value={values.budget ? `$${values.budget}` : ""}
										keyboardType="numeric"
									/>
									<View style={styles.fieldContainer}>
										<ATText style={styles.fieldHeader}>Estimated start date</ATText>
										<TouchableOpacity
											onPress={() => setModalVisible(true)}
											style={styles.textFieldContainer}
										>
											<Ionicons name="calendar" size={23} />
											<ATText>{values.estimatedStartDate.toLocaleDateString()}</ATText>
										</TouchableOpacity>
									</View>
									<View style={styles.fieldContainer}>
										<ATText style={styles.fieldHeader}>Add Photos</ATText>
										{imageUris.length < 1 ? (
											<TouchableOpacity
												style={styles.addIconContainer}
												onPress={showImagePickerOptions}
											>
												<Ionicons name="add" size={32} />
											</TouchableOpacity>
										) : (
											<>
												<MLCollage images={imageUris} matrix={matrixLayout[imageUris.length]} />
												<TouchableOpacity
													style={styles.morePhotos}
													onPress={showImagePickerOptions}
												>
													<ATText typography="secondaryText" color="secondaryTextColor">
														Add more photos...
													</ATText>
												</TouchableOpacity>
											</>
										)}
									</View>
									<ORDatePickerModal
										onClose={handleModalClose}
										onChange={(newDate) => {
											setSelectedDate(newDate);
											setFieldValue("estimatedStartDate", newDate);
										}}
										selectedDate={selectedDate}
										visible={modalVisible}
									/>
									{loading ? (
										<ActivityIndicator size="small" color="#0000ff" />
									) : (
										<MLButton label="Post Job" onPress={handleSubmit as () => void} />
									)}
								</View>
							)}
						</Formik>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	textArea: {
		height: 120,
		textAlignVertical: "top",
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
	fieldContainer: {
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	textFieldContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 15,
		backgroundColor: Colors.textBoxBackgroundColor,
		borderRadius: 12,
		paddingHorizontal: 17,
		height: 56,
	},
	fieldHeader: {
		marginBottom: 9,
	},
	addIconContainer: {
		alignSelf: "center",
		width: 120,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "black",
		borderStyle: "dashed",
		borderRadius: 12,
	},
	morePhotos: {
		alignSelf: "center",
		margin: 9,
	},
});
