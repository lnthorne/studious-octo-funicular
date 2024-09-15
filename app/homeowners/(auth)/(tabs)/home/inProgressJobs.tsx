import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { router, useFocusEffect } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function inProgressJobs() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [jobsInProgress, setJobsInProgress] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchJobsInProgress = async () => {
		if (!user) return;
		setLoading(true);
		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, JobStatus.inprogress);
			setJobsInProgress(jobs);
		} catch (error) {
			console.error("Failed to fetch jobs in progress:", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchJobsInProgress();
		}, [user])
	);

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}
	return (
		<View style={styles.container}>
			<FlatList
				data={jobsInProgress}
				keyExtractor={(item) => item.pid}
				renderItem={({ item }) => (
					<View style={styles.postContainer}>
						<TouchableOpacity
							onPress={() => router.push(`/homeowners/(auth)/jobDetails/${item.pid}`)}
						>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={styles.description}>{item.description}</Text>
							<Text style={styles.bidsTitle}>Bids:</Text>
						</TouchableOpacity>
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
				ListEmptyComponent={<Text>You have no jobs in progress.</Text>}
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
