import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Colors, Typography, TextField, View, TouchableOpacity } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Ionicons or another icon library
import { CustomText } from "../atoms/text";

interface CustomTextBoxProps {
	heading?: string; // Optional heading text
	placeholder?: string; // Placeholder (hint) inside the text box
	errorText?: string; // Error message to display when validation fails
	secureTextEntry?: boolean; // Toggle for password hider
	icon?: string; // Optional icon name (Ionicons in this case)
	onChangeText: (text: string) => void; // Callback to capture input value
	value?: string; // Current value of the text box
}

export const CustomTextBox: React.FC<CustomTextBoxProps> = ({
	heading,
	placeholder,
	errorText,
	secureTextEntry = false,
	icon,
	onChangeText,
	value = "",
}) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

	return (
		<>
			{heading && (
				<CustomText style={styles.heading} color="secondaryTextColor">
					{heading}
				</CustomText>
			)}

			<TextField
				value={value}
				placeholder={placeholder}
				placeholderTextColor={Colors.secondaryTextColor}
				secureTextEntry={isPasswordVisible}
				onChangeText={onChangeText}
				style={styles.textField}
			/>

			{secureTextEntry && (
				<TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
					<Ionicons
						name={isPasswordVisible ? "eye-off" : "eye"}
						size={24}
						color={Colors.secondaryTextColor}
					/>
				</TouchableOpacity>
			)}

			{errorText && (
				<Text style={{ ...Typography.error, color: "red", marginTop: 4 }}>{errorText}</Text>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	heading: {
		marginBottom: 9,
		marginLeft: 17,
	},
	textField: {
		backgroundColor: Colors.textBoxBackgroundColor,
		borderRadius: 12,
		paddingVertical: 23,
		paddingHorizontal: 17,
		marginBottom: 31,
		marginHorizontal: 16,
	},
});
