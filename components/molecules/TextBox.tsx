import React, { useState } from "react";
import { StyleSheet, TextInputProps, View } from "react-native";
import { TextField, TouchableOpacity } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { ATText } from "../atoms/Text";
import { Colors } from "@/app/design-system/designSystem";
import { ColorType } from "react-native-ui-lib/src/components/textField/types";

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
	editable = true,
	...props
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
					color={editable ? Colors.primaryTextColor : Colors.secondaryTextColor}
					fieldStyle={multiline ? styles.textArea : styles.textField}
					placeholder={placeholder}
					placeholderTextColor={Colors.secondaryTextColor as any}
					secureTextEntry={secureTextEntry && isPasswordVisible}
					onChangeText={onChangeText}
					keyboardType={keyboardType}
					onBlur={onBlur}
					multiline={multiline}
					numberOfLines={numberOfLines}
					editable={editable}
					{...props}
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
	},
	textArea: {
		minHeight: 144,
		maxHeight: 170,
		minWidth: 290,
		marginVertical: 10,
	},
	textAreaDisabled: {
		color: Colors.secondaryTextColor,
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	error: {
		marginTop: 3,
	},
});
