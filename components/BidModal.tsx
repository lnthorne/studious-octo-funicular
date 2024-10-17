// app/components/BidModal.tsx
import React from "react";
import { View, Text, StyleSheet, Modal, Button, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

interface BidModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (bidAmount: string, bidDescription: string) => void;
}

// Validation schema using Yup
const BidSchema = Yup.object().shape({
	bidAmount: Yup.number()
		.typeError("Bid amount must be a number")
		.positive("Bid amount must be a positive number")
		.required("Bid amount is required"),
	bidDescription: Yup.string()
		.min(10, "Bid description must be at least 10 characters long")
		.required("Bid description is required"),
});

export function BidModal({ visible, onClose, onSubmit }: BidModalProps) {
	return (
		<Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Place Your Bid</Text>

					<Formik
						initialValues={{ bidAmount: "", bidDescription: "" }}
						validationSchema={BidSchema}
						onSubmit={(values) => {
							onSubmit(values.bidAmount, values.bidDescription);
							onClose(); // Close the modal after submission
						}}
					>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
							<View style={{ width: "100%" }}>
								<TextInput
									placeholder="Bid Amount"
									value={values.bidAmount}
									onChangeText={handleChange("bidAmount")}
									onBlur={handleBlur("bidAmount")}
									style={[
										styles.input,
										touched.bidAmount && errors.bidAmount ? styles.inputError : null,
									]}
									keyboardType="numeric"
								/>
								{touched.bidAmount && errors.bidAmount && (
									<Text style={styles.errorText}>{errors.bidAmount}</Text>
								)}

								<TextInput
									placeholder="Bid Description"
									value={values.bidDescription}
									onChangeText={handleChange("bidDescription")}
									onBlur={handleBlur("bidDescription")}
									style={[
										styles.input,
										styles.textArea, // Apply the text area styling
										touched.bidDescription && errors.bidDescription ? styles.inputError : null,
									]}
									multiline
									numberOfLines={4} // Specifies the initial height of the multiline TextInput
								/>
								{touched.bidDescription && errors.bidDescription && (
									<Text style={styles.errorText}>{errors.bidDescription}</Text>
								)}

								<View style={styles.buttonContainer}>
									<Button title="Submit Bid" onPress={handleSubmit as any} />
									<Button title="Cancel" onPress={onClose} color="red" />
								</View>
							</View>
						)}
					</Formik>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "90%", // Increased the width to take up more of the modal's space
		backgroundColor: "white",
		borderRadius: 8,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	input: {
		width: "100%", // Make input fields take up the full width of the modal
		padding: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 5,
		marginBottom: 10,
	},
	textArea: {
		height: 80, // A default height for the multiline text input
		textAlignVertical: "top", // Ensures that text starts at the top of the input
	},
	inputError: {
		borderColor: "red",
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginBottom: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
});
