// app/home/index.tsx
import { useUser } from "@/contexts/userContext";
import { getJobsWithBidsByStatus } from "@/services/bid";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity, UserType } from "@/typings/user.inter";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Text,
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [jobsWithBids, setJobsWithBids] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchJobsAndBids = async () => {
		if (!user) return;
		setLoading(true);
		try {
			const jobs = await getJobsWithBidsByStatus(user.uid, JobStatus.open);
			setJobsWithBids(jobs);
		} catch (error) {
			console.error("Failed to fetch jobs and bids:", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchJobsAndBids();
		}, [user])
	);

	const handleBidPress = (bid: string) => {
		router.push(`/homeowners/bidDetails/${bid}`);
	};

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}
	return (
		<View style={styles.container}>
			<FlatList
				data={jobsWithBids}
				keyExtractor={(item) => item.pid}
				renderItem={({ item }) => (
					<View style={styles.postContainer}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.description}>{item.description}</Text>
						<Text style={styles.bidsTitle}>Bids:</Text>
						{item.bids?.map((bid) => (
							<TouchableOpacity key={bid.bid} onPress={() => handleBidPress(bid.bid)}>
								<View style={styles.bidContainer}>
									<Text>Company Name: {bid.companyName}</Text>
									<Text>Bid Amount: ${bid.bidAmount}</Text>
									<Text>Description: {bid.description}</Text>
									<Text>Status: {bid.status}</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>
				)}
				ListEmptyComponent={<Text>You have no open jobs.</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	postContainer: {
		backgroundColor: "#f9f9f9",
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	description: {
		fontSize: 14,
		marginVertical: 8,
	},
	bidsTitle: {
		marginTop: 16,
		fontSize: 16,
		fontWeight: "bold",
	},
	bidContainer: {
		marginTop: 8,
		padding: 8,
		backgroundColor: "#e9e9e9",
		borderRadius: 8,
	},
});
