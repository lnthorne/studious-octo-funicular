import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { IReview } from "@/typings/reviews.inter";
import { Colors, KeyboardAwareScrollView, Modal } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { ATText } from "./atoms/Text";
import { MLTextBox } from "./molecules/TextBox";
import { MLButton } from "./molecules/Button";

interface ReviewBottomSheetProps {
	homeownerId: string;
	companyOwnerId: string;
	visible: boolean;
	onClose: () => void;
	onSubmit?: (review: IReview) => void;
}

const ReviewSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	text: Yup.string().required("Review text is required"),
	rating: Yup.number().min(1, "Please select a rating").required("Rating is required"),
});

export default function ReviewBottomSheet({
	visible,
	onClose,
	onSubmit,
	companyOwnerId,
	homeownerId,
}: ReviewBottomSheetProps) {
	const [rating, setRating] = useState(0);

	const handleStarPress = (star: number, setFieldValue: (field: string, value: number) => void) => {
		setRating(star);
		setFieldValue("rating", star);
	};
	return (
		<Modal visible={visible} animationType="slide" transparent>
			<KeyboardAwareScrollView
				contentContainerStyle={styles.scrollContainer}
				enableOnAndroid={true}
				extraScrollHeight={50} // Adjust to move content above the keyboard
			>
				<View style={styles.drawerContainer}>
					<Formik
						initialValues={{ title: "", text: "", rating, homeownerId, companyOwnerId }}
						validationSchema={ReviewSchema}
						onSubmit={(values, { resetForm }: FormikHelpers<IReview>) => {
							onSubmit && onSubmit(values);
							resetForm();
							onClose();
						}}
					>
						{({
							handleChange,
							handleBlur,
							handleSubmit,
							values,
							errors,
							touched,
							setFieldValue,
						}) => (
							<>
								<ATText typography="secondaryText" color="error" style={styles.text}>
									* Required
								</ATText>
								<ATText typography="heading" style={styles.text}>
									Leave a Review
								</ATText>
								<View style={styles.starContainer}>
									{[1, 2, 3, 4, 5].map((star) => (
										<TouchableOpacity
											key={star}
											onPress={() => handleStarPress(star, setFieldValue)}
										>
											<Ionicons
												name={star <= rating ? "star" : "star-outline"}
												size={32}
												color={Colors.primaryButtonColor}
											/>
										</TouchableOpacity>
									))}
								</View>
								{errors.rating && touched.rating && (
									<ATText color="error" style={styles.text}>
										{errors.rating}
									</ATText>
								)}

								<MLTextBox
									placeholder="Title"
									onChangeText={handleChange("title")}
									value={values.title}
									onBlur={handleBlur("title")}
									errorText={touched.title && errors.title ? errors.title : undefined}
								/>
								<MLTextBox
									placeholder="Write your review..."
									multiline
									onChangeText={handleChange("text")}
									value={values.text}
									onBlur={handleBlur("text")}
									errorText={touched.text && errors.text ? errors.text : undefined}
								/>
								<MLButton variant="primary" label="Submit review" onPress={handleSubmit} />
							</>
						)}
					</Formik>
					{/* <View style={styles.spacer} /> */}
				</View>
			</KeyboardAwareScrollView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	drawerContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Colors.backgroundColor,
		paddingVertical: 20,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		shadowColor: Colors.shadowColor,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 5,
	},
	starContainer: {
		flexDirection: "row",
		paddingVertical: 15,
		paddingHorizontal: 16,
	},
	spacer: {
		marginTop: 300,
	},
	text: {
		paddingHorizontal: 16,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: "center",
	},
});
