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
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FirebaseError } from "firebase/app";
import { router } from "expo-router";
import { signUp } from "@/services/auth";
import { IHomeOwner, UserType } from "@/typings/user.inter";

const validationSchema = Yup.object().shape({
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
	zipcode: Yup.string().required("Zip code is required"),
	telephone: Yup.string().required("Phone number is required"),
});

export default function SignUp() {
	const [loading, setLoading] = useState(false);
	const [isSecurePasswordEntry, setIsSecurePasswordEntry] = useState(true);

	const initialValues: IHomeOwner = {
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		zipcode: "",
		telephone: "",
	};

	const handleSignUp = async (values: IHomeOwner) => {
		setLoading(true);
		try {
			await signUp<IHomeOwner>(UserType.homeowner, values);
		} catch (e: any) {
			const err = e as FirebaseError;
			alert("Registration failed: " + err.message);
		}
		setLoading(false);
	};
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.column}>
					<View style={styles.heading}>
						<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
							<Image
								source={require("../../assets/images/back-icon.png")}
								resizeMode={"stretch"}
								style={styles.backIcon}
							/>
						</TouchableOpacity>
						<View style={styles.view}>
							<Text style={styles.text}>{"Sign up"}</Text>
						</View>
					</View>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSignUp}
					>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
							<View>
								<Text style={styles.text2}>{"First name"}</Text>
								<TextInput
									placeholderTextColor="#4F964F"
									style={styles.view2}
									placeholder="First Name"
									onChangeText={handleChange("firstname")}
									onBlur={handleBlur("firstname")}
									value={values.firstname}
								/>
								{touched.firstname && errors.firstname && (
									<Text style={styles.errorText}>{errors.firstname}</Text>
								)}
								<Text style={styles.text2}>{"Last name"}</Text>
								<TextInput
									placeholderTextColor="#4F964F"
									style={styles.view3}
									placeholder="Last Name"
									onChangeText={handleChange("lastname")}
									onBlur={handleBlur("lastname")}
									value={values.lastname}
								/>
								{touched.lastname && errors.lastname && (
									<Text style={styles.errorText}>{errors.lastname}</Text>
								)}
								<Text style={styles.text4}>{"Email"}</Text>
								<TextInput
									placeholderTextColor="#4F964F"
									style={styles.view4}
									placeholder="Email"
									onChangeText={handleChange("email")}
									onBlur={handleBlur("email")}
									value={values.email}
									keyboardType="email-address"
								/>
								{touched.email && errors.email && (
									<Text style={styles.errorText}>{errors.email}</Text>
								)}
								<Text style={styles.text4}>{"Password"}</Text>
								<View style={styles.row}>
									<TextInput
										placeholderTextColor="#4F964F"
										style={styles.view5}
										placeholder="Password"
										onChangeText={handleChange("password")}
										onBlur={handleBlur("password")}
										value={values.password}
										secureTextEntry={isSecurePasswordEntry}
									/>
									<TouchableOpacity
										style={styles.view6}
										onPress={() => setIsSecurePasswordEntry(!isSecurePasswordEntry)}
									>
										<Image
											source={require("../../assets/images/show-password.png")}
											style={styles.image}
										/>
									</TouchableOpacity>
								</View>
								{touched.password && errors.password && (
									<Text style={styles.errorText}>{errors.password}</Text>
								)}

								<Text style={styles.text5}>{"Zip code"}</Text>
								<TextInput
									placeholderTextColor="#4F964F"
									style={styles.view4}
									placeholder="Zip code"
									onChangeText={handleChange("zipcode")}
									onBlur={handleBlur("zipcode")}
									value={values.zipcode}
								/>
								{touched.zipcode && errors.zipcode && (
									<Text style={styles.errorText}>{errors.zipcode}</Text>
								)}
								<Text style={styles.text6}>{"Phone number"}</Text>
								<TextInput
									placeholderTextColor="#4F964F"
									style={styles.view4}
									placeholder="Phone number"
									onChangeText={handleChange("telephone")}
									onBlur={handleBlur("telephone")}
									value={values.telephone}
									keyboardType="numeric"
								/>
								{touched.telephone && errors.telephone && (
									<Text style={styles.errorText}>{errors.telephone}</Text>
								)}

								{loading ? (
									<ActivityIndicator size="small" color="#0000ff" />
								) : (
									<TouchableOpacity
										onPress={handleSubmit as () => void}
										style={styles.signUpBtnContainer}
									>
										<Text style={styles.signUpBtn}>{"Sign up"}</Text>
									</TouchableOpacity>
								)}
							</View>
						)}
					</Formik>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F7FCF7",
	},
	heading: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		marginBottom: 27,
	},
	backBtn: {
		position: "absolute",
		left: 16,
		zIndex: 1,
	},
	backIcon: {
		width: 24,
		height: 24,
		marginTop: 28,
	},
	box: {
		height: 20,
		backgroundColor: "#F7FCF7",
	},
	column: {
		backgroundColor: "#F7FCF7",
		paddingBottom: 57,
	},
	image: {
		width: 24,
		height: 24,
	},
	row: {
		backgroundColor: "#E8F2E8",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
		marginHorizontal: 16,
		paddingVertical: 6,
		borderRadius: 12,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#F7FCF7",
	},
	text: {
		color: "#0C1C0C",
		fontSize: 22,
	},
	text2: {
		color: "#0C1C0C",
		fontSize: 16,
		marginBottom: 8,
		marginLeft: 17,
	},
	text3: {
		color: "#4F964F",
		fontSize: 16,
	},
	text4: {
		color: "#0C1C0C",
		fontSize: 16,
		marginBottom: 9,
		marginLeft: 17,
	},
	text5: {
		color: "#0C1C0C",
		fontSize: 16,
		marginBottom: 10,
		marginLeft: 16,
	},
	text6: {
		color: "#0C1C0C",
		fontSize: 16,
		marginBottom: 10,
		marginLeft: 17,
	},
	text7: {
		color: "#0C1C0C",
		fontSize: 19,
		marginBottom: 14,
		marginLeft: 166,
	},
	view: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#F7FCF7",
		color: "#4F964F",
		paddingTop: 22,
	},
	view2: {
		backgroundColor: "#E8F2E8",
		color: "#4F964F",
		fontSize: 16,
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 17,
		marginBottom: 15,
		marginHorizontal: 16,
	},
	view3: {
		backgroundColor: "#E8F2E8",
		color: "#4F964F",
		fontSize: 16,
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 17,
		marginBottom: 15,
		marginHorizontal: 16,
	},
	view4: {
		backgroundColor: "#E8F2E8",
		color: "#4F964F",
		fontSize: 16,
		borderRadius: 12,
		paddingVertical: 15,
		paddingHorizontal: 18,
		marginBottom: 15,
		marginHorizontal: 16,
	},
	view5: {
		backgroundColor: "#E8F2E8",
		width: 312,
		color: "#4F964F",
		paddingVertical: 8,
		paddingHorizontal: 17,
		borderRadius: 12,
		fontSize: 16,
	},
	view6: {
		width: 40,
		backgroundColor: "#E8F2E8",
	},
	errorText: {
		color: "red",
		marginHorizontal: 16,
		marginBottom: 15,
	},
	signUpBtnContainer: {
		alignItems: "center",
		backgroundColor: "#19E519",
		borderRadius: 24,
		paddingVertical: 20,
		marginBottom: 12,
		marginHorizontal: 16,
	},
	signUpBtn: {
		color: "#0C1C0C",
		fontSize: 16,
	},
});
