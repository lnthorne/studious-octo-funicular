import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ActivityIndicator,
	Image,
	TouchableOpacity,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { FirebaseError } from "firebase/app";
import { Formik } from "formik";
import * as Yup from "yup";
import { router } from "expo-router";
import { ILoginData } from "@/typings/auth/login.inter";
import { signIn } from "@/services/auth";
import { MLButton } from "@/components/molecules/Button";
import { MLTextBox } from "@/components/molecules/TextBox";

const validationSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email address").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

export default function SignIn() {
	const [loading, setLoading] = useState(false);

	const initialValues: ILoginData = {
		email: "",
		password: "",
	};

	const handleSignIn = async (values: ILoginData) => {
		setLoading(true);
		try {
			await signIn(values);
		} catch (e: any) {
			const err = e as FirebaseError;
			alert("Sign in failed: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior for keyboard appearance
				keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0} // Adjust if needed
			>
				<ScrollView style={styles.column}>
					<View style={styles.heading}>
						<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
							<Image
								source={require("../../assets/images/back-icon.png")}
								resizeMode={"stretch"}
								style={styles.backIcon}
							/>
						</TouchableOpacity>
						<Text style={styles.text}>{"Welcome Back!"}</Text>
					</View>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSignIn}
					>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
							<View>
								<MLTextBox
									onChangeText={handleChange("email")}
									heading="Email"
									placeholder="Email"
									value={values.email}
									keyboardType="email-address"
									onBlur={handleBlur("email")}
									errorText={touched.email && errors.email ? errors.email : undefined}
								/>
								<MLTextBox
									heading="Password"
									placeholder="Password"
									value={values.password}
									secureTextEntry
									onChangeText={handleChange("password")}
									onBlur={handleBlur("password")}
									errorText={touched.password && errors.password ? errors.password : undefined}
								/>

								{loading ? (
									<ActivityIndicator size="small" color="#0000ff" />
								) : (
									<>
										<MLButton label="Log in" variant="primary" onPress={handleSubmit} />
										<MLButton
											label="Continue with Google"
											variant="secondary"
											onPress={handleSubmit}
										/>
									</>
								)}
							</View>
						)}
					</Formik>
					<TouchableOpacity onPress={() => router.push("/homeowner/signUp")}>
						<Text style={styles.text5}>{"Don't have an account? Sign up"}</Text>
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7FCF7",
	},
	box: {
		height: 20,
		backgroundColor: "#F7FCF7",
	},
	column: {
		backgroundColor: "#F7FCF7",
		paddingBottom: 326,
	},
	heading: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		marginVertical: 27,
	},
	backBtn: {
		position: "absolute",
		left: 16,
		zIndex: 1,
	},
	backIcon: {
		width: 24,
		height: 24,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	text: {
		color: "#0C1C0C",
		fontSize: 22,
		// paddingTop: 10,
	},
	text2: {
		color: "#4F964F",
		fontSize: 16,
	},
	text3: {
		color: "#4F964F",
		fontSize: 14,
		marginBottom: 25,
		marginLeft: 17,
	},
	text4: {
		color: "#0C1C0C",
		fontSize: 16,
	},
	text5: {
		color: "#4F964F",
		fontSize: 14,
		marginBottom: 14,
		marginLeft: 94,
	},
	text6: {
		color: "#0C1C0C",
		fontSize: 16,
		marginBottom: 9,
		marginLeft: 17,
	},
	view: {
		backgroundColor: "#F7FCF7",
		paddingHorizontal: 16,
		marginBottom: 27,
	},
	view2: {
		backgroundColor: "#E8F2E8",
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 17,
		marginBottom: 15,
		marginHorizontal: 16,
	},
	view3: {
		backgroundColor: "#E8F2E8",
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 17,
		marginBottom: 15,
		marginHorizontal: 16,
	},
	view4: {
		alignItems: "center",
		backgroundColor: "#19E519",
		borderRadius: 24,
		paddingVertical: 20,
		marginBottom: 12,
		marginHorizontal: 16,
	},
	view5: {
		alignItems: "center",
		backgroundColor: "#E8F2E8",
		borderRadius: 24,
		paddingVertical: 19,
		marginBottom: 21,
		marginHorizontal: 16,
	},
	errorText: {
		color: "red",
		marginBottom: 10,
		marginHorizontal: 16,
	},
});
