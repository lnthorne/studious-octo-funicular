import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { acceptBidAndCloseOtherBids, fetchBidFromBid } from "@/services/bid";
import { IBidEntity } from "@/typings/jobs.inter";

export default function BidDetails() {
	const { bid } = useLocalSearchParams<{ bid: string }>();
	const [bidDetails, setBidDetails] = useState<IBidEntity | null>(null);

	useEffect(() => {
		const fetchBidDetails = async () => {
			if (bid) {
				try {
					const bidDetails = await fetchBidFromBid(bid);
					setBidDetails(bidDetails);
				} catch (error) {
					console.error("Error fetching bid details", error);
				}
			}
		};
		fetchBidDetails();
	}, [bid]);

	const handleAcceptBid = async () => {
		if (!bidDetails) return;

		try {
			await acceptBidAndCloseOtherBids(bidDetails.bid, bidDetails.pid);
			Alert.alert("Bid accepted successfully!");
			router.replace("/homeowners/(auth)/(tabs)");
		} catch (error) {
			console.error("Failed to accept bid:", error);
			Alert.alert("Failed to accept bid. Please try again.");
		}
	};

	if (!bidDetails) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size={"large"} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bid Details</Text>
			<Text>Company Name: {bidDetails.companyName}</Text>
			<Text>Bid Amount: ${bidDetails.bidAmount}</Text>
			<Text>Description: {bidDetails.description}</Text>
			<Text>Status: {bidDetails.status}</Text>
			<View style={styles.buttonContainer}>
				<Button title="Accept Bid" onPress={handleAcceptBid} />
				<Button title="CANCEL" onPress={() => router.back()} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	buttonContainer: {
		marginTop: 20,
		width: "100%",
		justifyContent: "space-around",
	},
});
