// app/home/index.tsx
import { Colors } from "@/app/design-system/designSystem";
import { ATText } from "@/components/atoms/Text";
import ORJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { useUser } from "@/contexts/userContext";
import { fetchBidsFromUid } from "@/services/bid";
import { fetchJobPostsByPidAndStaus } from "@/services/post";
import { BidStatus, IPostEntity } from "@/typings/jobs.inter";
import { ICompanyOwnerEntity } from "@/typings/user.inter";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Animated,
} from "react-native";

export default function BidInProgress() {
	const { user } = useUser<ICompanyOwnerEntity>();
	const opacity = useRef(new Animated.Value(0)).current;
	const { setSelectedJob, setBids } = useJobContext();
	const [isRefresh, setIsRefresh] = useState(false);
	const [filterVisible, setFilterVisible] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState<BidStatus[]>([
		BidStatus.accepted,
		BidStatus.waiting,
	]);
	const [filterTitle, setFilterTitle] = useState("All");
	const {
		data: bids,
		isLoading: isBidsLoading,
		isError: isBidsError,
		refetch: refetchBids,
	} = useQuery({
		queryKey: ["bids", user?.uid, selectedFilter],
		enabled: !!user?.uid,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		queryFn: async () => {
			return fetchBidsFromUid(user!.uid, selectedFilter);
		},
	});

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["jobPosts", bids],
		enabled: !!bids && bids.length > 0, // Only fetch if there are bids
		staleTime: 5 * 60 * 1000, // 5 minutes
		queryFn: async () => {
			const bidIds = bids!.map((bid) => bid.pid);
			return fetchJobPostsByPidAndStaus(bidIds);
		},
	});

	const onRefresh = async () => {
		setIsRefresh(true);
		await refetch();
		setIsRefresh(false);
	};

	const toggleFilterDropdown = () => {
		setFilterVisible((prevVisable) => !prevVisable);
	};

	const handleFilterSelect = async (status: BidStatus[]) => {
		setSelectedFilter(status);
		setFilterVisible(false);
		await onRefresh();
	};

	const handleJobSelection = (selectedJob: IPostEntity) => {
		setSelectedJob(selectedJob);
		router.navigate("/companyowner/jobDetailsPage");
	};

	useEffect(() => {
		if (!isLoading) {
			Animated.timing(opacity, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [isLoading]);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size={"large"} color={Colors.primaryButtonColor} />
			</SafeAreaView>
		);
	}

	if (isError) {
		return (
			<SafeAreaView style={[styles.container]}>
				<ATText typography="error" color="error" style={styles.center}>
					An error occurred. Please try again.
				</ATText>
			</SafeAreaView>
		);
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
							handleFilterSelect([BidStatus.accepted]);
							setFilterTitle("Accepted");
						}}
					>
						<Text style={styles.dropdownText}>Accepted</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							handleFilterSelect([BidStatus.waiting]);
							setFilterTitle("Waiting");
						}}
					>
						<Text style={styles.dropdownText}>Waiting</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							handleFilterSelect([BidStatus.accepted, BidStatus.waiting]);
							setFilterTitle("All");
						}}
					>
						<Text style={styles.dropdownText}>All</Text>
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.container}>
				<Animated.View style={[{ flex: 1 }, { opacity }]}>
					<ORJobListing
						data={data || []}
						isRefresh={isRefresh}
						onRefresh={onRefresh}
						onPress={handleJobSelection}
						chipLabel="View Job"
					/>
				</Animated.View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	center: {
		alignSelf: "center",
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
