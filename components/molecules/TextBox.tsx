import React, { useState } from "react";
import { StyleSheet, TextInputProps, View } from "react-native";
import { Text, Colors, Typography, TextField, TouchableOpacity } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { ATText } from "../atoms/Text";

interface CustomTextBoxProps extends TextInputProps {
	heading?: string;
	errorText?: string;
}

export const MLTextBox: React.FC<CustomTextBoxProps> = ({
	heading,
	placeholder,
	errorText,
	secureTextEntry = false,
	onChangeText,
	value,
	keyboardType,
	onBlur,
	multiline = false,
	numberOfLines,
}) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

	return (
		<View style={styles.container}>
			{heading && (
				<ATText style={styles.heading} color="primaryTextColor">
					{heading}
				</ATText>
			)}

			<View style={styles.textFieldContainer}>
				<TextField
					value={value}
					placeholder={placeholder}
					placeholderTextColor={Colors.secondaryTextColor}
					secureTextEntry={secureTextEntry && isPasswordVisible}
					onChangeText={onChangeText}
					style={multiline ? styles.textArea : styles.textField}
					keyboardType={keyboardType}
					onBlur={onBlur}
					multiline={multiline}
					numberOfLines={numberOfLines}
					allowFontScaling={false}
				/>

				{secureTextEntry && (
					<TouchableOpacity
						onPress={() => setIsPasswordVisible(!isPasswordVisible)}
						style={styles.iconContainer}
					>
						<Ionicons
							name={isPasswordVisible ? "eye-off" : "eye"}
							size={24}
							color={Colors.secondaryTextColor}
						/>
					</TouchableOpacity>
				)}
			</View>

			{errorText && (
				<ATText style={styles.error} color="error" typography="error">
					{errorText}
				</ATText>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	heading: {
		marginBottom: 9,
	},
	textFieldContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: Colors.textBoxBackgroundColor,
		borderRadius: 12,
		paddingHorizontal: 17,
	},
	textField: {
		height: 56,
		width: 290,
		...Typography.textBoxText,
		color: Colors.primaryTextColor,
		textAlignVertical: "auto",
	},
	textArea: {
		minHeight: 144,
		maxHeight: 170,
		minWidth: 290,
		marginVertical: 10,
		...Typography.textBoxText,
		color: Colors.primaryTextColor,
		textAlignVertical: "top",
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	error: {
		marginTop: 3,
	},
});
