import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
	ScrollView,
	Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { calculateReviewSummary, fetchCompanyReviews } from "@/services/review";
import { JobStatus } from "@/typings/jobs.inter";
import ReviewStats from "@/components/ReviewSummary";
import { Timestamp } from "@react-native-firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IReviewEntity } from "@/typings/reviews.inter";

export default function bidDetailsPage() {
	const opacity = useRef(new Animated.Value(0)).current;
	const queryClient = useQueryClient();
	const { selectedBid, selectedJob } = useJobContext();
	const { user } = useUser<IHomeOwnerEntity>();
	const { data, isLoading } = useQuery({
		queryKey: ["reviews", selectedBid!.uid],
		enabled: !!selectedBid,
		queryFn: () => fetchCompanyReviews(selectedBid!.uid),
		select: (reviews: IReviewEntity[]) => calculateReviewSummary(reviews),
	});

	const { mutate } = useMutation({
		mutationFn: async ({ bid, pid, uid }: { bid: string; pid: string; uid: string }) => {
			await acceptBidAndCloseOtherBids(bid, pid, uid);
		},
	});

	useEffect(() => {
		if (!isLoading) {
			Animated.timing(opacity, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [isLoading]);

	const handleCreateConversation = async () => {
		if (!user || !selectedBid) {
			Alert.alert("Error", "Please try again.");
			return;
		}
		try {
			const conversationId = await startNewConversation(user.uid, selectedBid.uid);
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

		mutate(
			{
				bid: selectedBid.bid,
				pid: selectedBid.pid,
				uid: selectedBid.uid,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["jobs", JobStatus.inprogress] });
					queryClient.invalidateQueries({ queryKey: ["jobs", JobStatus.open] });
					Alert.alert("Bid accepted successfully!");
					router.back();
				},
				onError: () => {
					Alert.alert("Failed to accept bid. Please try again");
				},
			}
		);
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size={"large"} color={Colors.primaryButtonColor} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={{ paddingVertical: 12 }}>
				<Animated.View style={[{ flex: 1, paddingHorizontal: 16 }, { opacity }]}>
					<ATText typography="heading">{selectedBid?.companyName}</ATText>
					<ReviewStats
						totalReviews={data?.totalReviews}
						averageRating={data?.averageRating}
						ratingPercentages={data?.ratingPercentages}
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
				</Animated.View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		paddingHorizontal: 20,
		paddingVertical: 40,
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
		paddingTop: 16,
		alignItems: "flex-start",
		alignSelf: "stretch",
	},
	messageContainer: {
		paddingTop: 8,
		height: 40,
		marginBottom: 25,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		alignSelf: "stretch",
	},
});
