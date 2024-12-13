import {
	View,
	ActivityIndicator,
	SafeAreaView,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Alert,
	TouchableOpacity,
	Animated,
} from "react-native";
import { signOut } from "@/services/auth";
import { MLButton } from "@/components/molecules/Button";
import { useUser } from "@/contexts/userContext";
import { IHomeOwner, IHomeOwnerEntity, UserType } from "@/typings/user.inter";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRef, useState } from "react";
import { MLTextBox } from "@/components/molecules/TextBox";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { updateProfileImage, updateUser } from "@/services/user";
import { useMutation } from "@tanstack/react-query";
import { Colors } from "@/app/design-system/designSystem";
import { router } from "expo-router";

const validationSchema = Yup.object().shape({
	firstname: Yup.string()
		.min(2, "First Name must be at least 2 characters")
		.required("First Name is required"),
	lastname: Yup.string()
		.min(2, "Last Name must be at least 2 characters")
		.required("Last Name is required"),
	email: Yup.string().email("Invalid email address").required("Email is required"),
	zipcode: Yup.string()
		.length(6, "Please enter valid postal code")
		.required("Postal code is required"),
	telephone: Yup.string().required("Phone number is required"),
});

export default function SettingsScreen() {
	const imageOpacity = useRef(new Animated.Value(0)).current;
	const { user, setUser } = useUser<IHomeOwnerEntity>();
	const [isEditing, setIsEditing] = useState(false);
	const [profileImage, setProfileImage] = useState(user?.profileImage);
	const { mutate: userMutation, isPending: userMutationIsPending } = useMutation({
		mutationFn: ({
			uid,
			values,
			userType,
		}: {
			uid: string;
			values: IHomeOwner;
			userType: UserType;
			newProfileImage?: string;
		}) => {
			return updateUser<IHomeOwner>(uid, values, userType);
		},
	});

	const { mutate: photoMutation } = useMutation({
		mutationFn: ({ uid, newProfileImage }: { uid: string; newProfileImage: string }) => {
			return updateProfileImage(uid, newProfileImage, UserType.homeowner);
		},
	});

	if (!user) {
		Alert.alert("Error", "Please try again.");
		return;
	}

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
			setProfileImage(uri);
			handleProfileImageUpdate(uri);
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

	const handleProfileImageUpdate = async (newProfileImage: string) => {
		photoMutation(
			{
				uid: user.uid,
				newProfileImage,
			},
			{
				onSuccess: (updateProfileImage) => {
					setUser({ ...user, profileImage: updateProfileImage });
				},
				onError: () => {
					Alert.alert("There was an error updating your profile picture. Please try again.");
				},
			}
		);
	};

	const handProfileUpdate = async (values: IHomeOwner) => {
		userMutation(
			{
				uid: user.uid,
				values,
				userType: UserType.homeowner,
			},
			{
				onSuccess: (updatedUser) => {
					setIsEditing(false);
					setUser({ ...user, ...updatedUser });
				},
				onError: () => {
					setIsEditing(false);
					Alert.alert("There was an error updating your profile. Please try again.");
				},
			}
		);
	};

	const handleImageLoad = () => {
		Animated.timing(imageOpacity, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	};

	const initialValues: IHomeOwner = {
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		zipcode: user.zipcode,
		telephone: user.telephone,
	};
	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={{ paddingTop: 10 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior for keyboard appearance
				keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // Adjust if needed
			>
				<ScrollView keyboardDismissMode="on-drag">
					{profileImage ? (
						<TouchableOpacity onPress={showImagePickerOptions} style={styles.imageContainer}>
							<Animated.Image
								style={[styles.image, { opacity: imageOpacity }]}
								source={{ uri: profileImage }}
								onLoadEnd={handleImageLoad}
							/>
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.addIconContainer} onPress={showImagePickerOptions}>
							<Ionicons name="camera" size={32} style={styles.iconOverlay} color={"grey"} />
						</TouchableOpacity>
					)}
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handProfileUpdate}
					>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched, setValues }) => (
							<View>
								<MLTextBox
									onChangeText={handleChange("firstname")}
									heading="First name"
									placeholder="First name"
									value={values.firstname}
									onBlur={handleBlur("firstname")}
									errorText={touched.firstname && errors.firstname ? errors.firstname : undefined}
									editable={isEditing}
								/>
								<MLTextBox
									onChangeText={handleChange("lastname")}
									heading="Last name"
									placeholder="Last name"
									value={values.lastname}
									onBlur={handleBlur("lastname")}
									errorText={touched.lastname && errors.lastname ? errors.lastname : undefined}
									editable={isEditing}
								/>
								<MLTextBox
									onChangeText={handleChange("email")}
									heading="Email"
									placeholder="Email"
									value={values.email}
									keyboardType="email-address"
									onBlur={handleBlur("email")}
									errorText={touched.email && errors.email ? errors.email : undefined}
									editable={isEditing}
								/>

								<MLTextBox
									heading="Postal code"
									placeholder="Postal code"
									value={values.zipcode}
									onChangeText={(text) => {
										const formattedText = text.replace(/\s+/g, "");
										handleChange("zipcode")(formattedText);
									}}
									onBlur={handleBlur("zipcode")}
									errorText={touched.zipcode && errors.zipcode ? errors.zipcode : undefined}
									editable={isEditing}
									autoCapitalize="characters"
									maxLength={6}
								/>
								<MLTextBox
									onChangeText={handleChange("telephone")}
									heading="Phone number"
									placeholder="Phone number"
									value={values.telephone}
									keyboardType="numeric"
									onBlur={handleBlur("telephone")}
									errorText={touched.telephone && errors.telephone ? errors.telephone : undefined}
									editable={isEditing}
								/>

								{userMutationIsPending && (
									<ActivityIndicator size="large" color={Colors.primaryButtonColor} />
								)}

								{!userMutationIsPending &&
									(isEditing ? (
										<View style={styles.buttonRow}>
											<MLButton label="Save" onPress={handleSubmit} style={styles.button} />
											<MLButton
												label="Cancel"
												variant="secondary"
												style={styles.button}
												onPress={() => {
													setValues(initialValues);
													setIsEditing(false);
												}}
											/>
										</View>
									) : (
										<MLButton label="Edit" onPress={() => setIsEditing(true)} />
									))}
							</View>
						)}
					</Formik>
					<MLButton
						label="Logout"
						onPress={async () => {
							await signOut();
							router.replace("/");
						}}
						variant="secondary"
					/>
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
	imageContainer: {
		width: 140,
		height: 140,
		position: "relative",
		marginBottom: 10,
		alignSelf: "center",
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 70,
	},
	imageTint: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 70,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		zIndex: 1,
	},
	addIconContainer: {
		alignSelf: "center",
		width: 140,
		height: 140,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "black",
		borderStyle: "dashed",
		borderRadius: 70,
	},
	heading: {
		marginBottom: 9,
	},
	buttonRow: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-start",
		alignSelf: "stretch",
		gap: 12,
	},
	button: {
		width: 175,
		minWidth: 84,
		maxWidth: 480,
		marginHorizontal: 0,
	},
	iconOverlay: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -16 }, { translateY: -16 }],
		zIndex: 1,
	},
});
