import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useJobContext } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { startNewConversation } from "@/services/messaging";
import { router } from "expo-router";
import { MLButton } from "@/components/molecules/Button";
import { Colors } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { acceptBidAndCloseOtherBids } from "@/services/bid";
import { IReviewEntity, ReviewSummary } from "@/typings/reviews.inter";
import { calculateReviewSummary, fetchCompanyReviews } from "@/services/review";
import { JobStatus } from "@/typings/jobs.inter";
import ReviewStats from "@/components/ReviewSummary";

export default function bidDetailsPage() {
	const { selectedBid, selectedJob } = useJobContext();
	const { user } = useUser<IHomeOwnerEntity>();
	const [reviewData, setReviewData] = useState<ReviewSummary>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getReviewData();
		console.log("REview data", reviewData);
	}, [selectedBid]);

	const getReviewData = async () => {
		if (!selectedBid) return;
		setLoading(true);
		try {
			const reviews = await fetchCompanyReviews(selectedBid.uid);
			const summary = calculateReviewSummary(reviews);
			setReviewData(summary);
		} catch (error) {
			console.error("There was an error getting review data", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateConversation = async () => {
		if (!user || !selectedBid) {
			Alert.alert("Error", "Please try again.");
			return;
		}
		try {
			const conversationId = await startNewConversation(user.uid, selectedBid.uid);
			// TODO: figure out name stuff
			router.navigate({
				pathname: "/shared/messages/[conversationId]",
				params: {
					conversationId,
					name: "John Doe",
				},
			});
		} catch (error) {
			console.error("Error creating conversation:", error);
			Alert.alert("Error creating conversation. Please try again.");
		}
	};

	const handleAcceptBid = async () => {
		if (!selectedBid) return;

		try {
			await acceptBidAndCloseOtherBids(selectedBid.bid, selectedBid.pid, selectedBid.uid);
			Alert.alert("Bid accepted successfully!");
			router.back();
		} catch (error) {
			console.error("Failed to accept bid:", error);
			Alert.alert("Failed to accept bid. Please try again.");
		}
	};

	// if (loading) {
	// 	return (
	// 		<View style={styles.container}>
	// 			<ActivityIndicator size={"large"} />
	// 		</View>
	// 	);
	// }
	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1, paddingHorizontal: 16 }}>
				<ReviewStats
					totalReviews={reviewData?.totalReviews}
					averageRating={reviewData?.averageRating}
					ratingPercentages={reviewData?.ratingPercentages}
				/>
				<ATText>{selectedBid?.companyName}</ATText>
				<View style={styles.subHeader}>
					<ATText typography="subheading">Message Bidder</ATText>
				</View>
				<TouchableOpacity style={styles.row}>
					<ATText typography="textBoxText" style={{ flexDirection: "column" }}>
						Start a conversation with Liam
					</ATText>
					<Ionicons name="send" size={24} style={{ flexDirection: "column" }} />
				</TouchableOpacity>
				{selectedJob?.jobStatus === JobStatus.open && (
					<MLButton label="Accept Bid" onPress={handleAcceptBid} />
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	subHeader: {
		alignItems: "flex-start",
		alignSelf: "stretch",
	},
	row: {
		flexDirection: "row",
		height: 56,
		justifyContent: "space-between",
		alignItems: "center",
		alignSelf: "stretch",
	},
});
