import { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator, Image } from "react-native";
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
		<View style={styles.container}>
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
				onSubmit={handleSignIn}
			>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
					<View>
						<TextInput
							style={styles.input}
							placeholder="Email"
							onChangeText={handleChange("email")}
							onBlur={handleBlur("email")}
							value={values.email}
							keyboardType="email-address"
						/>
						{touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

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
								<Button onPress={handleSubmit as () => void} title="Sign In" />
								<Button
									onPress={() => {
										router.replace("/companyowners/signUp");
									}}
									title="Sign Up"
								/>
							</>
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
	errorText: {
		color: "red",
		marginBottom: 10,
	},
});
