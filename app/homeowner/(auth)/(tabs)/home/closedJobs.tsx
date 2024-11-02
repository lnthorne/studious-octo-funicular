import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { router, useFocusEffect } from "expo-router";
import ORHomeownerJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { Colors } from "react-native-ui-lib";

export default function closedJobs() {
	const { user } = useUser<IHomeOwnerEntity>();
	const { jobs, setJobs, setSelectedJob } = useJobContext();
	const [loading, setLoading] = useState(true);
	const [isRefresh, setIsRefresh] = useState(false);

	const fetchClosedJobs = async (isRefreshing: boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, [JobStatus.completed]);
			setJobs(jobs);
		} catch (error) {
			console.error("Failed to fetch closed jobs:", error);
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
			fetchClosedJobs();
		}, [user])
	);

	const onRefresh = () => {
		setIsRefresh(true);
		fetchClosedJobs(true);
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
			<ORHomeownerJobListing
				data={jobs}
				isRefresh={isRefresh}
				onRefresh={onRefresh}
				onPress={handleJobSelection}
				chipLabel="View"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
});
