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
} from "react-native";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FirebaseError } from "firebase/app";
import { router } from "expo-router";
import { signUp } from "@/services/auth";
import { ICompanyOwner, UserType } from "@/typings/user.inter";

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
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"} // Behavior for keyboard appearance
				keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0} // Adjust if needed
			>
				<ScrollView>
					<Text style={{ fontSize: 20, marginBottom: 20 }}>COMPANY OWNER</Text>
					<Image
						source={require("../../assets/images/Landscape_Connect_Logo.png")}
						style={{
							width: 200,
							height: 200,
							marginLeft: 80,
							marginBottom: 20,
						}}
					/>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSignUp}
					>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
							<View>
								<TextInput
									style={styles.input}
									placeholder="Company Name"
									onChangeText={handleChange("companyName")}
									onBlur={handleBlur("companyName")}
									value={values.companyName}
								/>
								{touched.companyName && errors.companyName && (
									<Text style={styles.errorText}>{errors.companyName}</Text>
								)}

								<TextInput
									style={styles.input}
									placeholder="Email"
									onChangeText={handleChange("email")}
									onBlur={handleBlur("email")}
									value={values.email}
									keyboardType="email-address"
								/>
								{touched.email && errors.email && (
									<Text style={styles.errorText}>{errors.email}</Text>
								)}

								<TextInput
									style={styles.input}
									placeholder="Password"
									onChangeText={handleChange("password")}
									onBlur={handleBlur("password")}
									value={values.password}
									secureTextEntry
								/>
								{touched.password && errors.password && (
									<Text style={styles.errorText}>{errors.password}</Text>
								)}

								{loading ? (
									<ActivityIndicator size="small" color="#0000ff" />
								) : (
									<>
										<Button onPress={handleSubmit as () => void} title="Sign Up" />
										<Button
											onPress={() => {
												router.replace("/companyowners/signIn");
											}}
											title="Sign In"
										/>
									</>
								)}
							</View>
						)}
					</Formik>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
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
	errorText: {
		color: "red",
		marginBottom: 10,
	},
});
