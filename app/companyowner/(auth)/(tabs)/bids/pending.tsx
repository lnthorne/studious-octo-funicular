// app/home/index.tsx
import { Colors } from "@/app/design-system/designSystem";
import { ATText } from "@/components/atoms/Text";
import ORJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { useUser } from "@/contexts/userContext";
import { fetchBidsFromUid } from "@/services/bid";
import { fetchJobPostsByPidAndStaus } from "@/services/post";
import { BidStatus, IBidEntity, IPostEntity } from "@/typings/jobs.inter";
import { ICompanyOwnerEntity } from "@/typings/user.inter";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Text,
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	RefreshControl,
	SafeAreaView,
	Animated,
} from "react-native";

export default function Pending() {
	const { user } = useUser<ICompanyOwnerEntity>();
	const { setSelectedJob, setBids } = useJobContext();
	const opacity = useRef(new Animated.Value(0)).current;
	const [isRefresh, setIsRefresh] = useState(false);
	const {
		data: bids,
		isLoading: isBidsLoading,
		isError: isBidsError,
		refetch: refetchBids,
	} = useQuery({
		queryKey: ["bids", user?.uid, BidStatus.pending],
		enabled: !!user?.uid,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		queryFn: async () => {
			const bids = await fetchBidsFromUid(user!.uid, [BidStatus.pending]);
			setBids(bids);
			return bids;
		},
		select: (bids) => {
			const bidIds = bids!.map((bid) => bid.pid);
			return bidIds;
		},
	});

	const {
		data: jobPosts,
		isLoading: isJobPostsLoading,
		isError: isJobPostsError,
		refetch: refetchJobPosts,
	} = useQuery({
		queryKey: ["jobPosts", bids],
		enabled: !!bids && bids.length > 0,
		staleTime: 5 * 60 * 1000, // 5 minutes
		queryFn: async () => {
			if (bids) {
				return fetchJobPostsByPidAndStaus(bids);
			}
			return [];
		},
	});

	const handleJobSelection = (selectedJob: IPostEntity) => {
		setSelectedJob(selectedJob);
		router.navigate("/companyowner/jobDetailsPage");
	};
	const onRefresh = async () => {
		setIsRefresh(true);
		await refetchBids();
		await refetchJobPosts();
		setIsRefresh(false);
	};

	useEffect(() => {
		if (!isBidsLoading || isJobPostsLoading) {
			Animated.timing(opacity, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [isBidsLoading, isJobPostsLoading]);

	if (isBidsLoading || isJobPostsLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size={"large"} color={Colors.primaryButtonColor} />
			</SafeAreaView>
		);
	}

	if (isBidsError || isJobPostsError) {
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
			<Animated.View style={[{ flex: 1 }, { opacity }]}>
				<ORJobListing
					data={jobPosts || []}
					isRefresh={isRefresh}
					onRefresh={onRefresh}
					onPress={handleJobSelection}
					chipLabel="View Job"
				/>
			</Animated.View>
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
});
