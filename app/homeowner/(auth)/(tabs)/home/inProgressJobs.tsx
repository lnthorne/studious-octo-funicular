import { ActivityIndicator, Animated, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { router, useFocusEffect } from "expo-router";
import ORJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { useQuery } from "@tanstack/react-query";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "@/app/design-system/designSystem";

export default function inProgressJobs() {
	const opacity = useRef(new Animated.Value(0)).current;
	const { user } = useUser<IHomeOwnerEntity>();
	const { setSelectedJob } = useJobContext();
	const [isRefresh, setIsRefresh] = useState(false);
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["jobs", JobStatus.inprogress],
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		enabled: !!user?.uid,
		queryFn: () => fetchJobsWithBidsByStatus(user!.uid, [JobStatus.inprogress]),
	});

	useEffect(() => {
		if (!isLoading) {
			Animated.timing(opacity, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [isLoading]);

	const onRefresh = async () => {
		setIsRefresh(true);
		await refetch();
		setIsRefresh(false);
	};

	const handleJobSelection = (selectedJob: IPostEntity) => {
		setSelectedJob(selectedJob);
		router.navigate("/homeowner/jobDetailsPage");
	};

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
			<Animated.View style={[{ flex: 1 }, { opacity }]}>
				<ORJobListing
					data={data || []}
					isRefresh={isRefresh}
					onRefresh={onRefresh}
					onPress={handleJobSelection}
					chipLabel="View"
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
