// app/home/index.tsx
import BidDetailsModal from "@/components/BidDetailsModal";
import { useUser } from "@/contexts/userContext";
import { fetchJobsWithBidsByStatus } from "@/services/post";
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
	RefreshControl,
} from "react-native";

export default function HomeScreen() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [jobsWithBids, setJobsWithBids] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedBid, setSelectedBid] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);

	const fetchJobsAndBids = async (isRefreshing: boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, [JobStatus.open]);
			setJobsWithBids(jobs);
		} catch (error) {
			console.error("Failed to fetch jobs and bids:", error);
		} finally {
			if (isRefreshing) {
				setIsRefresh(false);
			} else {
				setLoading(false);
			}
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchJobsAndBids();
		}, [user])
	);

	const openModal = (bid: string) => {
		setSelectedBid(bid);
		setModalVisible(true);
	};

	const closeModal = (isRefresh?: boolean) => {
		setModalVisible(false);
		setSelectedBid(null);
		if (isRefresh) fetchJobsAndBids();
	};

	const onRefresh = () => {
		setIsRefresh(true);
		fetchJobsAndBids(true);
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
							<TouchableOpacity key={bid.bid} onPress={() => openModal(bid.bid)}>
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
				refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
			/>
			<BidDetailsModal visible={modalVisible} bid={selectedBid} onClose={closeModal} />
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
