// app/home/index.tsx
import { useUser } from "@/contexts/userContext";
import { fetchBidsFromUid } from "@/services/bid";
import { BidStatus, IBidEntity } from "@/typings/jobs.inter";
import { ICompanyOwnerEntity } from "@/typings/user.inter";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Text,
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";

export default function Pending() {
	const { user } = useUser<ICompanyOwnerEntity>();
	const [bidData, setBidData] = useState<IBidEntity[] | null>();
	const [loading, setLoading] = useState(true);

	const fetchBids = async () => {
		if (!user) return;
		setLoading(true);
		try {
			const bids = await fetchBidsFromUid(user.uid, BidStatus.pending);
			setBidData(bids);
		} catch (error) {
			console.error("Failed to fetch bids:", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchBids();
		}, [user])
	);

	const handleBidPress = (bid: string) => {
		router.push(`/companyowners/bidDetails/${bid}`);
	};

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}
	return (
		<View style={styles.container}>
			<FlatList
				data={bidData}
				keyExtractor={(item) => item.pid}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleBidPress(item.bid)}>
						<View style={styles.postContainer}>
							<Text style={styles.title}>${item.bidAmount}</Text>
							<Text style={styles.description}>{item.description}</Text>
							<Text style={styles.status}>Status: {item.status}</Text>
						</View>
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={styles.title}>No bids available.</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
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
	status: {
		fontSize: 12,
		color: "gray",
	},
});
