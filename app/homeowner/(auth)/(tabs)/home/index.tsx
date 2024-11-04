// app/home/index.tsx
import { useUser } from "@/contexts/userContext";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, SafeAreaView, StyleSheet, View } from "react-native";
import ORHomeownerJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { Colors } from "react-native-ui-lib";

export default function HomeScreen() {
	const opacity = useRef(new Animated.Value(0)).current;
	const { user } = useUser<IHomeOwnerEntity>();
	const { jobs, setJobs, setSelectedJob } = useJobContext();
	const [loading, setLoading] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);

	const fetchJobsAndBids = async (isRefreshing: boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, [JobStatus.open]);
			setJobs(jobs);
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
			opacity.setValue(0);
			fetchJobsAndBids();
		}, [user])
	);

	useEffect(() => {
		if (!loading) {
			Animated.timing(opacity, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [loading]);

	const onRefresh = () => {
		setIsRefresh(true);
		fetchJobsAndBids(true);
	};

	const handleJobSelection = (selectedJob: IPostEntity) => {
		setSelectedJob(selectedJob);
		router.navigate("/homeowner/jobDetailsPage");
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size={"large"} color={Colors.primaryButtonColor} />
			</SafeAreaView>
		);
	}
	return (
		<View style={styles.container}>
			<Animated.View style={[{ flex: 1 }, { opacity }]}>
				<ORHomeownerJobListing
					data={jobs}
					isRefresh={isRefresh}
					onRefresh={onRefresh}
					onPress={handleJobSelection}
					chipLabel="View Bids"
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
});
