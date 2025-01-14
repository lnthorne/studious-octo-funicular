import React from "react";
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { ATText } from "./atoms/Text";
import { MLButton } from "./molecules/Button";

interface GeneralModalProps {
	visible: boolean;
	description: string;
	onDone: () => void;
	onCancel: () => void;
}

export default function GeneralModal({
	visible,
	description,
	onDone,
	onCancel,
}: GeneralModalProps) {
	return (
		<Modal
			transparent={true}
			visible={visible}
			animationType="fade"
			onRequestClose={onCancel} // Close on back button press (Android)
		>
			{/* Touch outside the modal to close */}
			<TouchableWithoutFeedback onPress={onCancel}>
				<View style={styles.modalBackground}>
					<TouchableWithoutFeedback onPress={() => {}}>
						<View style={styles.modalContainer}>
							<ATText style={styles.description}>{description}</ATText>

							<View style={styles.buttonContainer}>
								{/* Done Button */}
								<MLButton label="Done" variant="primary" style={styles.button} onPress={onDone} />
								<MLButton
									label="Cancel"
									variant="secondary"
									style={styles.button}
									onPress={onCancel}
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
	modalContainer: {
		width: "80%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	description: {
		marginBottom: 20,
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-start",
		alignSelf: "stretch",
		gap: 5,
	},
	button: {
		width: 120,
	},
});
