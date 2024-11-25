import { Colors } from "@/app/design-system/designSystem";
import { IBid } from "@/typings/jobs.inter";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Formik, FormikHelpers } from "formik";
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { ATText } from "./atoms/Text";
import ORDatePickerModal from "./DatePickerModal";
import { Ionicons } from "@expo/vector-icons";
import { MLButton } from "./molecules/Button";

interface BidBottomSheetProps {
	onSubmit: (reviewData: IBid) => void;
}

const BidSchema = Yup.object().shape({
	amount: Yup.string().required("Amount is required"),
	details: Yup.string()
		.min(10, "Description must be at least 10 characters long")
		.required("Description is required"),
	date: Yup.date().required("Date is required"),
});

const BidBottomSheet = React.forwardRef<BottomSheet, BidBottomSheetProps>(({ onSubmit }, ref) => {
	const snapPoints = useMemo(() => ["60%", "90%"], []);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const handleModalClose = () => {
		setModalVisible(false);
	};

	return (
		<BottomSheet
			ref={ref}
			index={0}
			snapPoints={snapPoints}
			backgroundStyle={{ backgroundColor: Colors.backgroundColor }}
			style={styles.shadow}
			enableDynamicSizing={false}
			handleStyle={{ display: "none" }}
			keyboardBehavior="extend"
			enablePanDownToClose={true}
		>
			<Formik
				initialValues={{ amount: 0, details: "", date: new Date() }}
				validationSchema={BidSchema}
				onSubmit={(values) => {
					onSubmit && onSubmit(values);
				}}
			>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
					<>
						<ATText typography="heading" style={styles.text}>
							Creat a bid
						</ATText>
						<View style={[styles.textFieldContainer]}>
							<BottomSheetTextInput
								placeholder="Amount"
								placeholderTextColor={Colors.secondaryTextColor}
								onChangeText={(budget) => {
									const numericValue = budget.replace(/[^0-9.]/g, "");
									setFieldValue("amount", numericValue);
								}}
								value={values.amount ? `$${values.amount}` : ""}
								onBlur={handleBlur("amount")}
								style={styles.textField}
								keyboardType="numeric"
							/>
						</View>
						{errors.amount && touched.amount && (
							<ATText color="error" style={styles.text}>
								{errors.amount}
							</ATText>
						)}

						<View style={[styles.textFieldContainer]}>
							<BottomSheetTextInput
								placeholder="Write your details..."
								placeholderTextColor={Colors.secondaryTextColor}
								multiline
								onChangeText={handleChange("details")}
								value={values.details}
								onBlur={handleBlur("details")}
								style={styles.textArea}
							/>
						</View>
						{errors.details && touched.details && (
							<ATText color="error" style={styles.text}>
								{errors.details}
							</ATText>
						)}
						<View style={styles.dateFieldContainer}>
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
});

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
	text: {
		paddingHorizontal: 16,
	},
	textFieldContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: Colors.textBoxBackgroundColor,
		borderRadius: 12,
		paddingHorizontal: 17,
		marginVertical: 12,
		marginHorizontal: 16,
	},
	dateFieldContainer: {
		paddingVertical: 12,
		paddingHorizontal: 16,
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
