import { useState } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
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
import { ICompanyOwnerSignUp } from "@/typings/auth/login.inter";
import { selectProfileImage, showImagePickerOptions } from "../shared/camera";
import { Ionicons } from "@expo/vector-icons";
import useAnimation from "@/hooks/useAnimation";

const validationSchema = Yup.object().shape({
	companyName: Yup.string()
		.min(2, "First Name must be at least 2 characters")
		.required("First Name is required"),
	email: Yup.string().email("Invalid email address").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	profileImage: Yup.string().required("Profile picture is required"),
});

export default function SignUp() {
	const { startAnimation } = useAnimation();
	const [loading, setLoading] = useState(false);
	const videoSource = require("../../assets/splash/provider-onboarding.mp4");

	const initialValues: ICompanyOwnerSignUp = {
		companyName: "",
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

	const handleSignUp = async (values: ICompanyOwnerSignUp) => {
		setLoading(true);
		const isSkippable = true;
		try {
			await signUp<ICompanyOwnerSignUp>(UserType.companyowner, values);
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
				<ScrollView>
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
									onChangeText={handleChange("companyName")}
									heading="Company name"
									placeholder="Company name"
									value={values.companyName}
									onBlur={handleBlur("companyName")}
									errorText={
										touched.companyName && errors.companyName ? errors.companyName : undefined
									}
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
									<ActivityIndicator size="small" color="#0000ff" />
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
