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
								<Text style={styles.text6}>{"Email"}</Text>
								<View style={styles.view2}>
									<TextInput
										style={styles.text2}
										placeholderTextColor="#4F964F"
										placeholder="Email"
										onChangeText={handleChange("email")}
										onBlur={handleBlur("email")}
										value={values.email}
										keyboardType="email-address"
									/>
								</View>

								{touched.email && errors.email && (
									<Text style={styles.errorText}>{errors.email}</Text>
								)}
								<Text style={styles.text6}>{"Password"}</Text>
								<View style={styles.view3}>
									<TextInput
										style={styles.text2}
										placeholderTextColor="#4F964F"
										placeholder="Password"
										onChangeText={handleChange("password")}
										onBlur={handleBlur("password")}
										value={values.password}
										secureTextEntry
									/>
								</View>
								{touched.password && errors.password && (
									<Text style={styles.errorText}>{errors.password}</Text>
								)}

								{loading ? (
									<ActivityIndicator size="small" color="#0000ff" />
								) : (
									<>
										<TouchableOpacity onPress={handleSubmit as () => void} style={styles.view4}>
											<Text style={styles.text4}>{"Log in"}</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.view5}>
											<Text style={styles.text4}>{"Continue with Google"}</Text>
										</TouchableOpacity>
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
