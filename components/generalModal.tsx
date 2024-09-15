import React from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";

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
			animationType="slide"
			onRequestClose={onCancel} // Close on back button press (Android)
		>
			{/* Touch outside the modal to close */}
			<TouchableWithoutFeedback onPress={onCancel}>
				<View style={styles.modalBackground}>
					<TouchableWithoutFeedback onPress={() => {}}>
						<View style={styles.modalContainer}>
							<Text style={styles.description}>{description}</Text>

							<View style={styles.buttonContainer}>
								{/* Done Button */}
								<TouchableOpacity onPress={onDone} style={styles.doneButton}>
									<Text style={styles.buttonText}>Done</Text>
								</TouchableOpacity>

								{/* Cancel Button */}
								<TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
									<Text style={styles.buttonText}>Cancel</Text>
								</TouchableOpacity>
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
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	doneButton: {
		backgroundColor: "#4CAF50",
		padding: 10,
		borderRadius: 5,
		width: "45%",
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#f44336",
		padding: 10,
		borderRadius: 5,
		width: "45%",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
	},
});
