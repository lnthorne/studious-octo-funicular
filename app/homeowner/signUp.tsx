import { useState } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	Image,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { FirebaseError } from "firebase/app";
import { signUp } from "@/services/auth";
import { UserType } from "@/typings/user.inter";
import { MLTextBox } from "@/components/molecules/TextBox";
import { MLButton } from "@/components/molecules/Button";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "../design-system/designSystem";
import { IHomeOwnerSignUp } from "@/typings/auth/login.inter";
import { selectProfileImage, showImagePickerOptions } from "../shared/camera";
import { Ionicons } from "@expo/vector-icons";
import useAnimation from "@/hooks/useAnimation";

const validationSchema = Yup.object().shape({
	profileImage: Yup.string().required("Profile picture is required"),
	firstname: Yup.string()
		.min(2, "First Name must be at least 2 characters")
		.required("First Name is required"),
	lastname: Yup.string()
		.min(2, "Last Name must be at least 2 characters")
		.required("Last Name is required"),
	email: Yup.string().email("Invalid email address").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	zipcode: Yup.string()
		.length(6, "Please enter valid postal code")
		.required("Postal code is required"),
	telephone: Yup.string().required("Phone number is required"),
});

export default function SignUp() {
	const { startAnimation } = useAnimation();
	const [loading, setLoading] = useState(false);
	const videoSource = require("../../assets/splash/homeowner-onboarding.mp4");

	const initialValues: IHomeOwnerSignUp = {
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		zipcode: "",
		telephone: "",
		profileImage: "",
	};

	const pickImage = async (
		fromCamera: boolean,
		setFieldValue: (field: string, value: any) => void
	) => {
		const uri = await selectProfileImage(fromCamera);
		if (uri) {
			setFieldValue("profileImage", uri);
		}
	};

	const handleSignUp = async (values: IHomeOwnerSignUp) => {
		setLoading(true);
		const isSkippable = true;
		try {
			await signUp<IHomeOwnerSignUp>(UserType.homeowner, values);
			startAnimation(videoSource, () => {}, isSkippable);
		} catch (e: any) {
			const err = e as FirebaseError;
			alert("Registration failed: " + err.message);
		}
		setLoading(false);
	};
	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior for keyboard appearance
				keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // Adjust if needed
			>
				<ScrollView keyboardDismissMode="on-drag">
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSignUp}
					>
						{({
							handleChange,
							handleBlur,
							handleSubmit,
							values,
							errors,
							touched,
							setFieldValue,
						}) => (
							<View style={{ marginTop: 10 }}>
								{values.profileImage ? (
									<TouchableOpacity
										onPress={() =>
											showImagePickerOptions((fromCamera) => pickImage(fromCamera, setFieldValue))
										}
										style={styles.imageContainer}
									>
										<Image style={styles.image} source={{ uri: values.profileImage }} />
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										style={styles.addIconContainer}
										onPress={() =>
											showImagePickerOptions((fromCamera) => pickImage(fromCamera, setFieldValue))
										}
									>
										<Ionicons name="camera" size={32} style={styles.iconOverlay} color={"grey"} />
									</TouchableOpacity>
								)}
								{errors.profileImage && (
									<ATText style={styles.error} color="error" typography="error">
										{errors.profileImage}
									</ATText>
								)}
								<MLTextBox
									onChangeText={handleChange("firstname")}
									heading="First name"
									placeholder="First name"
									value={values.firstname}
									onBlur={handleBlur("firstname")}
									errorText={touched.firstname && errors.firstname ? errors.firstname : undefined}
								/>
								<MLTextBox
									onChangeText={handleChange("lastname")}
									heading="Last name"
									placeholder="Last name"
									value={values.lastname}
									onBlur={handleBlur("lastname")}
									errorText={touched.lastname && errors.lastname ? errors.lastname : undefined}
								/>
								<MLTextBox
									onChangeText={handleChange("email")}
									heading="Email"
									placeholder="Email"
									value={values.email}
									keyboardType="email-address"
									onBlur={handleBlur("email")}
									autoCapitalize="none"
									errorText={touched.email && errors.email ? errors.email : undefined}
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
									autoCapitalize="characters"
									maxLength={6}
									errorText={touched.zipcode && errors.zipcode ? errors.zipcode : undefined}
								/>
								<MLTextBox
									onChangeText={handleChange("telephone")}
									heading="Phone number"
									placeholder="Phone number"
									value={values.telephone}
									keyboardType="numeric"
									onBlur={handleBlur("telephone")}
									errorText={touched.telephone && errors.telephone ? errors.telephone : undefined}
								/>

								<MLTextBox
									heading="Password"
									placeholder="Password"
									value={values.password}
									secureTextEntry
									onChangeText={handleChange("password")}
									onBlur={handleBlur("password")}
									autoCapitalize="none"
									errorText={touched.password && errors.password ? errors.password : undefined}
								/>

								{loading ? (
									<ActivityIndicator size="small" color={Colors.primaryButtonColor} />
								) : (
									<MLButton label="Sign up" variant="primary" onPress={handleSubmit} />
								)}
							</View>
						)}
					</Formik>
					<TouchableOpacity>
						<ATText style={styles.optionText} typography="secondaryText" color="secondaryTextColor">
							By signing up, you agree to the Terms of Use and Privacy Policy.
						</ATText>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		paddingBottom: 60,
	},
	optionText: {
		textAlign: "center",
		alignSelf: "center",
		paddingHorizontal: 16,
		paddingTop: 4,
		paddingBottom: 12,
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
	iconOverlay: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: [{ translateX: -16 }, { translateY: -16 }],
		zIndex: 1,
	},
	error: {
		alignSelf: "center",
		marginTop: 3,
	},
});
