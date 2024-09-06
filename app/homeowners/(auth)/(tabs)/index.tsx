// app/home/index.tsx
import { fetchAllOpenJobsWithBids } from "@/services/bid";
import { getUser } from "@/services/user";
import { IPostEntity } from "@/typings/jobs.inter";
import { IHomeOwnerEntity, UserType } from "@/typings/user.inter";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Text,
	View,
	StyleSheet,
	FlatList,
	Touchable,
	TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
	const [userData, setUserData] = useState<IHomeOwnerEntity | null>();
	const [jobsWithBids, setJobsWithBids] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const user = await getUser<IHomeOwnerEntity>(UserType.homeowner);
				if (!user) {
					return;
				}
				setUserData(user);
			} catch (error) {
				console.error("Error fetching user data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	useFocusEffect(
		useCallback(() => {
			if (!userData) return;

			const fetchJobsAndBids = async () => {
				setLoading(true);
				try {
					const jobs = await fetchAllOpenJobsWithBids(userData.uid);
					setJobsWithBids(jobs);
				} catch (error) {
					console.error("Failed to fetch jobs and bids:", error);
				} finally {
					setLoading(false);
				}
			};

			fetchJobsAndBids();
		}, [userData])
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
						{item.bids && item.bids.length > 0 ? (
							item.bids.map((bid) => (
								<TouchableOpacity key={bid.bid} onPress={() => handleBidPress(bid.bid)}>
									<View style={styles.bidContainer}>
										<Text>Company Name: {bid.companyName}</Text>
										<Text>Bid Amount: ${bid.bidAmount}</Text>
										<Text>Description: {bid.description}</Text>
										<Text>Status: {bid.status}</Text>
									</View>
								</TouchableOpacity>
							))
						) : (
							<Text>No bids available for this post.</Text>
						)}
					</View>
				)}
				ListEmptyComponent={<Text>No open jobs available.</Text>}
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
