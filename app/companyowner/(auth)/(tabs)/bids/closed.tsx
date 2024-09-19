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
	RefreshControl,
} from "react-native";

export default function BidInClosed() {
	const { user } = useUser<ICompanyOwnerEntity>();
	const [bidData, setBidData] = useState<IBidEntity[] | null>();
	const [loading, setLoading] = useState(true);
	const [filterVisible, setFilterVisible] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState<BidStatus[]>([BidStatus.completed]);
	const [filterTitle, setFilterTitle] = useState("Completed");
	const [isRefresh, setIsRefresh] = useState(false);

	const fetchBids = async (status: BidStatus[], isRefreshing: boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		try {
			const bids = await fetchBidsFromUid(user.uid, status);
			setBidData(bids);
		} catch (error) {
			console.error("Failed to fetch bids:", error);
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
			fetchBids(selectedFilter);
		}, [user, selectedFilter])
	);

	const onRefresh = () => {
		setIsRefresh(true);
		fetchBids(selectedFilter, true);
	};

	const toggleFilterDropdown = () => {
		setFilterVisible((prevVisable) => !prevVisable);
	};

	const handleFilterSelect = (status: BidStatus[]) => {
		setSelectedFilter(status);
		setFilterVisible(false);
	};

	const handleBidPress = (bid: string) => {
		router.push(`/companyowner/bidDetails/${bid}`);
	};

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={toggleFilterDropdown} style={styles.filterButton}>
				<Text style={styles.filterText}>Filter by Status: {filterTitle}</Text>
			</TouchableOpacity>

			{filterVisible && (
				<View style={styles.dropdown}>
					<TouchableOpacity
						onPress={() => {
							handleFilterSelect([BidStatus.completed]);
							setFilterTitle("Completed");
						}}
					>
						<Text style={styles.dropdownText}>Completed</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							handleFilterSelect([BidStatus.rejected]);
							setFilterTitle("Rejected");
						}}
					>
						<Text style={styles.dropdownText}>Rejected</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							handleFilterSelect([BidStatus.rejected, BidStatus.completed]);
							setFilterTitle("All");
						}}
					>
						<Text style={styles.dropdownText}>All</Text>
					</TouchableOpacity>
				</View>
			)}

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
				refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
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
	filterButton: {
		marginBottom: 10,
		backgroundColor: "#007bff",
		padding: 10,
		borderRadius: 5,
	},
	filterText: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	dropdown: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 5,
		borderColor: "#ccc",
		borderWidth: 1,
		marginBottom: 10,
	},
	dropdownText: {
		paddingVertical: 8,
		fontSize: 16,
	},
});
