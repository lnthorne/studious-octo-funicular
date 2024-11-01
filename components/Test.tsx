import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Yup from "yup";
import { Colors } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { ATText } from "./atoms/Text";
import { Formik, FormikHelpers } from "formik";
import { MLButton } from "./molecules/Button";

interface ReviewBottomSheetProps {
	onSubmit: (reviewData: ReviewForm) => void;
}

interface ReviewForm {
	rating: number;
	title?: string;
	text?: string;
}

const ReviewSchema = Yup.object().shape({
	rating: Yup.number().min(1, "Please select a rating").required("Rating is required"),
});

// Use forwardRef to pass a reference to the parent component
const ReviewBottomSheet = React.forwardRef<BottomSheet, ReviewBottomSheetProps>(
	({ onSubmit }, ref) => {
		const [rating, setRating] = useState(0);
		const snapPoints = useMemo(() => ["60%", "90%"], []);

		const handleStarPress = (
			star: number,
			setFieldValue: (field: string, value: number) => void
		) => {
			setRating(star);
			setFieldValue("rating", star);
		};

		return (
			<BottomSheet
				ref={ref}
				snapPoints={snapPoints}
				backgroundStyle={{ backgroundColor: Colors.backgroundColor }}
				style={styles.shadow}
				enableDynamicSizing={false}
				handleStyle={{ display: "none" }}
				keyboardBehavior="extend"
			>
				<Formik
					initialValues={{ title: "", text: "", rating }}
					validationSchema={ReviewSchema}
					onSubmit={(values, { resetForm }: FormikHelpers<ReviewForm>) => {
						onSubmit && onSubmit(values);
						resetForm();
					}}
				>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
						<>
							<ATText typography="heading" style={styles.text}>
								Leave a Review
							</ATText>
							<View style={styles.starContainer}>
								{[1, 2, 3, 4, 5].map((star) => (
									<TouchableOpacity key={star} onPress={() => handleStarPress(star, setFieldValue)}>
										<Ionicons
											name={star <= rating ? "star" : "star-outline"}
											size={32}
											color={Colors.primaryButtonColor}
										/>
									</TouchableOpacity>
								))}
								<ATText color="error">*</ATText>
							</View>
							{errors.rating && touched.rating && (
								<ATText color="error" style={styles.text}>
									{errors.rating}
								</ATText>
							)}
							<View style={[styles.textFieldContainer]}>
								<BottomSheetTextInput
									placeholder="Title"
									placeholderTextColor={Colors.secondaryTextColor}
									onChangeText={handleChange("title")}
									value={values.title}
									onBlur={handleBlur("title")}
									style={styles.textField}
								/>
							</View>

							<View style={[styles.textFieldContainer]}>
								<BottomSheetTextInput
									placeholder="Write your review..."
									placeholderTextColor={Colors.secondaryTextColor}
									multiline
									onChangeText={handleChange("text")}
									value={values.text}
									onBlur={handleBlur("text")}
									style={styles.textArea}
								/>
							</View>
							<MLButton variant="primary" label="Submit review" onPress={handleSubmit} />
						</>
					)}
				</Formik>
			</BottomSheet>
		);
	}
);

export default ReviewBottomSheet;

const styles = StyleSheet.create({
	shadow: {
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		shadowColor: Colors.shadowColor,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 5,
		paddingVertical: 8,
	},
	starContainer: {
		flexDirection: "row",
		paddingVertical: 15,
		paddingHorizontal: 16,
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
	textField: {
		height: 56,
		width: 290,
		color: Colors.primaryTextColor,
		textAlignVertical: "auto",
	},
	textArea: {
		minHeight: 144,
		maxHeight: 170,
		minWidth: 290,
		marginVertical: 10,
		color: Colors.primaryTextColor,
		textAlignVertical: "top",
	},
});
