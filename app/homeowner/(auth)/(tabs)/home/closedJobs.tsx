import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { useFocusEffect } from "expo-router";

export default function closedJobs() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [closedJobs, setClosedJobs] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchClosedJobs = async () => {
		if (!user) return;
		setLoading(true);
		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, [JobStatus.completed]);
			setClosedJobs(jobs);
		} catch (error) {
			console.error("Failed to fetch closed jobs:", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchClosedJobs();
		}, [user])
	);

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={closedJobs}
				keyExtractor={(item) => item.pid}
				renderItem={({ item }) => (
					<View style={styles.postContainer}>
						<Text style={styles.title}>{item.title}</Text>
						<Text style={styles.description}>{item.description}</Text>
						<Text style={styles.bidsTitle}>Bids:</Text>
						{item.bids?.map((bid) => (
							<View style={styles.bidContainer} key={bid.bid}>
								<Text>Company Name: {bid.companyName}</Text>
								<Text>Bid Amount: ${bid.bidAmount}</Text>
								<Text>Description: {bid.description}</Text>
								<Text>Status: {bid.status}</Text>
							</View>
						))}
					</View>
				)}
				ListEmptyComponent={<Text>You have no closed jobs.</Text>}
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
