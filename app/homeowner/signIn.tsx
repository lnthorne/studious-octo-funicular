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
import { ATText } from "@/components/atoms/Text";
import { Colors } from "../design-system/designSystem";

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
			<ScrollView keyboardDismissMode="on-drag">
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
							<TouchableOpacity>
								<ATText
									style={styles.optionText}
									typography="secondaryText"
									color="secondaryTextColor"
								>
									Forgot password?
								</ATText>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => router.navigate("/homeowner/signUp")}>
								<ATText
									style={styles.optionText}
									typography="secondaryText"
									color="secondaryTextColor"
								>
									Don't have an account? Sign Up
								</ATText>
							</TouchableOpacity>

							{loading ? (
								<ActivityIndicator size="small" color={Colors.primaryButtonColor} />
							) : (
								<MLButton label="Log in" variant="primary" onPress={handleSubmit} />
							)}
						</View>
					)}
				</Formik>
			</ScrollView>
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
		alignSelf: "center",
		paddingHorizontal: 16,
		paddingTop: 4,
		paddingBottom: 12,
	},
});
