import { useState } from "react";
import {
	Button,
	Text,
	TextInput,
	View,
	StyleSheet,
	Image,
	ActivityIndicator,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FirebaseError } from "firebase/app";
import { router } from "expo-router";
import { signUp } from "@/services/auth";
import { ICompanyOwner, UserType } from "@/typings/user.inter";
import { MLTextBox } from "@/components/molecules/TextBox";
import { Colors } from "react-native-ui-lib";
import { MLButton } from "@/components/molecules/Button";
import { ATText } from "@/components/atoms/Text";

const validationSchema = Yup.object().shape({
	companyName: Yup.string()
		.min(2, "First Name must be at least 2 characters")
		.required("First Name is required"),
	email: Yup.string().email("Invalid email address").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

export default function SignUp() {
	const [loading, setLoading] = useState(false);

	const initialValues: ICompanyOwner = {
		companyName: "",
		email: "",
		password: "",
		zipcode: "",
		telephone: "",
	};

	const handleSignUp = async (values: ICompanyOwner) => {
		setLoading(true);
		try {
			await signUp<ICompanyOwner>(UserType.companyowner, values);
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
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
							<View>
								<MLTextBox
									onChangeText={handleChange("Company name")}
									heading="Conpany name"
									placeholder="Company name"
									value={values.companyName}
									onBlur={handleBlur("companyname")}
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
									errorText={touched.email && errors.email ? errors.email : undefined}
								/>

								<MLTextBox
									heading="Postal code"
									placeholder="Postal code"
									value={values.zipcode}
									onChangeText={handleChange("zipcode")}
									onBlur={handleBlur("zipcode")}
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
});