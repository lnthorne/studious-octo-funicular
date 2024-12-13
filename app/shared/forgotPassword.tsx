import { ATText } from "@/components/atoms/Text";
import { MLButton } from "@/components/molecules/Button";
import { MLTextBox } from "@/components/molecules/TextBox";
import { resetPassword } from "@/services/auth";
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { Colors } from "../design-system/designSystem";

export default function ForgotPasswordScreen() {
	const [email, setEmail] = useState("");

	const handleResetPassword = async () => {
		try {
			await resetPassword(email);
			Alert.alert("Success", "Password reset email sent. Check your inbox.");
		} catch (error) {
			Alert.alert("Error", "Failed to send password reset email. Please try again.");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView keyboardDismissMode="on-drag">
				<MLTextBox
					placeholder="Enter your email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<MLButton
					label="Send Reset Email"
					variant="primary"
					onPress={handleResetPassword}
					style={styles.input}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		padding: 16,
	},
	title: {
		marginVertical: 20,
		alignSelf: "center",
	},
	input: {},
});
