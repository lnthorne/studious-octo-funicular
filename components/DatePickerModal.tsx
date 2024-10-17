import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Colors, Modal } from "react-native-ui-lib";

interface DatePickerProps {
	visible: boolean;
	selectedDate: Date;
	onClose: () => void;
	onChange: (date: Date) => void;
}

export default function ORDatePickerModal({
	visible,
	selectedDate,
	onClose,
	onChange,
}: DatePickerProps) {
	return (
		<Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.modalBackground}>
					<TouchableWithoutFeedback onPress={() => {}}>
						<View style={styles.modalContainer}>
							<RNDateTimePicker
								value={selectedDate}
								onChange={(event, newDate) => {
									if (newDate) {
										onChange(newDate);
									}
								}}
								display="inline"
								accentColor={Colors.primaryButtonColor}
								themeVariant="light"
								minimumDate={new Date()}
							/>
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
		width: "90%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
});
