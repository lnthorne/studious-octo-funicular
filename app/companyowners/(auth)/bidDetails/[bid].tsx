import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { IBidEntity, IPostEntity } from "@/typings/jobs.inter";
import { fetchBidFromBid } from "@/services/bid";
import { fetchPost } from "@/services/post";
import {
	ActivityIndicator,
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	SafeAreaView,
} from "react-native";

export default function BidDetails() {
	const { bid } = useLocalSearchParams<{ bid: string }>();
	const [bidDetails, setBidDetails] = useState<IBidEntity | null>(null);
	const [loading, setLoading] = useState(true);
	const [posting, setPosting] = useState<IPostEntity | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		if (!bid) return;

		setLoading(true);
		setError(null);

		try {
			const bidDetails = await fetchBidFromBid(bid);
			setBidDetails(bidDetails);

			if (bidDetails) {
				const postData = await fetchPost(bidDetails.pid);
				setPosting(postData);
			} else {
				console.error("Bid not found or no bid with the provided ID");
				setError("Bid not found or no bid with the provided ID");
			}
		} catch (error) {
			console.error("Error fetching data", error);
			setError("Failed to load bid and posting details.");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, [bid]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#007BFF" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	if (!bidDetails || !posting) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>No bid details or posting found.</Text>
			</View>
		);
	}

	return (
		<SafeAreaView>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Job Details</Text>
					<Text style={styles.label}>Title:</Text>
					<Text style={styles.value}>{posting.title}</Text>
					<Text style={styles.label}>Description:</Text>
					<Text style={styles.value}>{posting.description}</Text>
					{posting.imageUrls?.map((url, index) => {
						return <Image source={{ uri: url }} style={styles.image} key={index} />;
					})}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Your Bid</Text>
					<Text style={styles.label}>Amount:</Text>
					<Text style={styles.value}>${bidDetails.bidAmount}</Text>
					<Text style={styles.label}>Bid Description:</Text>
					<Text style={styles.value}>{bidDetails.description}</Text>
					<Text style={styles.label}>Status:</Text>
					<Text style={styles.value}>{bidDetails.status}</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		color: "#FF0000",
		fontSize: 16,
		textAlign: "center",
	},
	container: {
		padding: 20,
		backgroundColor: "#F5F5F5",
	},
	section: {
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		padding: 15,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333333",
	},
	label: {
		fontSize: 16,
		color: "#555555",
		marginTop: 10,
	},
	value: {
		fontSize: 16,
		color: "#000000",
		marginBottom: 5,
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		marginTop: 10,
	},
});
