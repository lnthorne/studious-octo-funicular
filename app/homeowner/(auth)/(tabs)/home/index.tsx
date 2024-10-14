// app/home/index.tsx
import ATChip from "@/components/atoms/Chips";
import { ATText } from "@/components/atoms/Text";
import { useUser } from "@/contexts/userContext";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Text,
	View,
	StyleSheet,
	FlatList,
	RefreshControl,
	Image,
} from "react-native";
import { Timestamp } from "@react-native-firebase/firestore";

export default function HomeScreen() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [jobsWithBids, setJobsWithBids] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);
	const [isRefresh, setIsRefresh] = useState(false);

	const fetchJobsAndBids = async (isRefreshing: boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, [JobStatus.open]);
			setJobsWithBids(jobs);
			console.log(jobs[0]);
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

	const getDaysAgo = (createdAt: Timestamp) => {
		const createdDate = createdAt.toDate();
		const currentDate = new Date();

		const diffTime = currentDate.getTime() - createdDate.getTime();

		// Convert the time difference to days
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 1000 ms * 60 s * 60 m * 24 h

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "1 day ago";
		return `${diffDays} days ago`;
	};

	const shortenTitle = (title: string): string => {
		if (title.length > 19) {
			return title.substring(0, 16) + "...";
		}
		return title;
	};

	const getpostImage = (uri: string | undefined) => {
		if (uri) return { uri };

		return require("../../../../../assets/images/welcome.png");
	};

	useFocusEffect(
		useCallback(() => {
			fetchJobsAndBids();
		}, [user])
	);

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
						<Image source={getpostImage(item.imageUrls?.[0])} style={styles.image} />
						<View style={styles.column}>
							<ATText typography="body">{shortenTitle(item.title)}</ATText>
							<ATText typography="secondary" color="secondaryTextColor">
								{getDaysAgo(item.createdAt as Timestamp)}
							</ATText>
						</View>
						<ATChip label="View Bids" isToggled={false} onPress={() => ({})} />
					</View>
				)}
				ListEmptyComponent={<Text>You have no open jobs.</Text>}
				refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
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
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		minHeight: 76,
	},
	column: {
		flex: 1,
		marginRight: 4,
		paddingHorizontal: 10,
	},
	image: {
		height: 56,
		width: 56,
		borderRadius: 8,
	},
});
