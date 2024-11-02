import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
	ScrollView,
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
import { Timestamp } from "@react-native-firebase/firestore";

export default function bidDetailsPage() {
	const { selectedBid, selectedJob } = useJobContext();
	const { user } = useUser<IHomeOwnerEntity>();
	const [reviewData, setReviewData] = useState<ReviewSummary>();
	const [loading, setLoading] = useState(false);

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
			const usersName = user.firstname + " " + user.lastname;
			const conversationId = await startNewConversation(
				user.uid,
				selectedBid.uid,
				usersName,
				selectedBid.companyName
			);
			router.navigate({
				pathname: "/shared/messages/[conversationId]",
				params: {
					conversationId,
					name: selectedBid.companyName,
				},
			});
		} catch (error) {
			console.error("Error creating conversation:", error);
			Alert.alert("Error creating conversation. Please try again.");
		}
	};

	const getDaysAgo = (createdAt: Timestamp) => {
		const createdDate = createdAt.toDate();
		const currentDate = new Date();

		const diffTime = currentDate.getTime() - createdDate.getTime();

		// Convert the time difference to days
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 1000 ms * 60 s * 60 m * 24 h

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "1d ago";
		return `${diffDays}d ago`;
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

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size={"large"} color={Colors.primaryButtonColor} />
			</SafeAreaView>
		);
	}
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={{ flex: 1, paddingHorizontal: 16 }}>
					<ATText typography="heading">{selectedBid?.companyName}</ATText>
					<ReviewStats
						totalReviews={reviewData?.totalReviews}
						averageRating={reviewData?.averageRating}
						ratingPercentages={reviewData?.ratingPercentages}
					/>
					<View style={styles.detailsContainer}>
						<Image source={require("../../../assets/images/onboarding.png")} style={styles.image} />
						<View style={{ flex: 1 }}>
							<ATText>{`$${selectedBid?.bidAmount}`}</ATText>
							<ATText typography="secondaryText" color="secondaryTextColor">
								{selectedBid?.description}
							</ATText>
						</View>
						<ATText typography="secondaryText" color="secondaryTextColor">
							{getDaysAgo(selectedBid?.createdAt as Timestamp)}
						</ATText>
					</View>
					<View style={styles.subHeader}>
						<ATText typography="subheading">Message Bidder</ATText>
					</View>
					<TouchableOpacity style={styles.messageContainer} onPress={handleCreateConversation}>
						<ATText typography="textBoxText" style={{ flexDirection: "column" }}>
							{`Start a conversation with ${selectedBid?.companyName}`}
						</ATText>
						<Ionicons name="send" size={24} style={{ flexDirection: "column" }} />
					</TouchableOpacity>
					{selectedJob?.jobStatus === JobStatus.open && (
						<MLButton label="Accept Bid" onPress={handleAcceptBid} />
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	detailsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
		paddingVertical: 12,
	},
	image: {
		width: 48,
		height: 48,
		borderRadius: 8,
	},
	subHeader: {
		alignItems: "flex-start",
		alignSelf: "stretch",
	},
	messageContainer: {
		paddingTop: 8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		alignSelf: "stretch",
	},
});
