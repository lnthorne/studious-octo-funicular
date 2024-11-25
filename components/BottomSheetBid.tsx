import { Colors } from "@/app/design-system/designSystem";
import { IBid } from "@/typings/jobs.inter";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Keyboard } from "react-native";
import * as Yup from "yup";
import { ATText } from "./atoms/Text";
import ORDatePickerModal from "./DatePickerModal";
import { Ionicons } from "@expo/vector-icons";
import { MLButton } from "./molecules/Button";
import { useUser } from "@/contexts/userContext";
import { ICompanyOwnerEntity } from "@/typings/user.inter";

interface BidBottomSheetProps {
	initialValues: IBid;
	onSubmit: (reviewData: IBid) => void;
}

const BidSchema = Yup.object().shape({
	bidAmount: Yup.number()
		.required("Amount is required")
		.positive("Bid amount must be greater than zero"),
	description: Yup.string()
		.min(10, "Description must be at least 10 characters long")
		.required("Description is required"),
	date: Yup.date().required("Date is required"),
});

const BidBottomSheet = React.forwardRef<BottomSheet, BidBottomSheetProps>(
	({ onSubmit, initialValues }, ref) => {
		const snapPoints = useMemo(() => ["72%", "90%"], []);
		const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
		const [modalVisible, setModalVisible] = useState(false);
		const [selectedDate, setSelectedDate] = useState(new Date());

		const handleModalClose = () => {
			setModalVisible(false);
		};

		useEffect(() => {
			const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
				setIsKeyboardOpen(true);
			});

			const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
				setIsKeyboardOpen(false);
			});

			return () => {
				keyboardDidShowListener.remove();
				keyboardDidHideListener.remove();
			};
		}, []);

		return (
			<BottomSheet
				ref={ref}
				index={-1}
				snapPoints={snapPoints}
				backgroundStyle={{ backgroundColor: Colors.backgroundColor }}
				style={styles.shadow}
				enableDynamicSizing={false}
				handleStyle={{ display: "none" }}
				keyboardBehavior="extend"
				enablePanDownToClose={!isKeyboardOpen}
			>
				<Formik
					initialValues={initialValues}
					validationSchema={BidSchema}
					onSubmit={(values) => {
						onSubmit && onSubmit(values);
					}}
				>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
						<>
							<ATText typography="heading" style={{ paddingHorizontal: 16 }}>
								Creat a bid
							</ATText>
							<View style={styles.container}>
								<ATText style={styles.heading} color="primaryTextColor">
									Amount
								</ATText>
								<View style={[styles.textFieldContainer]}>
									<BottomSheetTextInput
										placeholder="Amount"
										placeholderTextColor={Colors.secondaryTextColor}
										onChangeText={(bidAmount) => {
											const numericValue = bidAmount.replace(/[^0-9.]/g, "");
											setFieldValue("bidAmount", numericValue);
										}}
										value={values.bidAmount ? `$${values.bidAmount}` : ""}
										onBlur={handleBlur("amount")}
										style={styles.textField}
										keyboardType="numeric"
									/>
								</View>
								{errors.bidAmount && touched.bidAmount && (
									<ATText color="error">{errors.bidAmount}</ATText>
								)}
							</View>
							<View style={styles.container}>
								<ATText style={styles.heading} color="primaryTextColor">
									Details
								</ATText>
								<View style={[styles.textFieldContainer]}>
									<BottomSheetTextInput
										placeholder="Write your details..."
										placeholderTextColor={Colors.secondaryTextColor}
										multiline
										onChangeText={handleChange("description")}
										value={values.description}
										onBlur={handleBlur("details")}
										style={styles.textArea}
									/>
								</View>
								{errors.description && touched.description && (
									<ATText color="error">{errors.description}</ATText>
								)}
							</View>
							<View style={styles.container}>
								<ATText style={styles.heading} color="primaryTextColor">
									Estimated start date
								</ATText>
								<TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dateField}>
									<Ionicons name="calendar" size={23} />
									<ATText>{values.date.toLocaleDateString()}</ATText>
								</TouchableOpacity>
							</View>

							<ORDatePickerModal
								onClose={handleModalClose}
								onChange={(newDate) => {
									setSelectedDate(newDate);
									setFieldValue("date", newDate);
								}}
								selectedDate={selectedDate}
								visible={modalVisible}
							/>
							<MLButton variant="primary" label="Apply for this job" onPress={handleSubmit} />
						</>
					)}
				</Formik>
			</BottomSheet>
		);
	}
);

export default BidBottomSheet;

const styles = StyleSheet.create({
	shadow: {
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		backgroundColor: Colors.backgroundColor,
		shadowColor: Colors.shadowColor,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 5,
		paddingVertical: 8,
	},
	heading: {
		marginBottom: 9,
	},
	container: {
		marginVertical: 12,
		marginHorizontal: 16,
	},
	textFieldContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: Colors.textBoxBackgroundColor,
		borderRadius: 12,
		paddingHorizontal: 17,
	},
	dateField: {
		flexDirection: "row",
		alignItems: "center",
		gap: 15,
		backgroundColor: Colors.textBoxBackgroundColor,
		borderRadius: 12,
		paddingHorizontal: 17,
		height: 56,
	},
	textArea: {
		minHeight: 144,
		maxHeight: 170,
		minWidth: 290,
		marginVertical: 10,
		textAlignVertical: "top",
	},
	textField: {
		height: 56,
		width: 290,
	},
	fieldContainer: {
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	fieldHeader: {
		marginBottom: 9,
	},
});
