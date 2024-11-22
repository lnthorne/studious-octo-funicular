import { ActivityIndicator, Animated, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { router, useFocusEffect } from "expo-router";
import ORHomeownerJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { useQuery } from "@tanstack/react-query";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "@/app/design-system/designSystem";

export default function closedJobs() {
	const opacity = useRef(new Animated.Value(0)).current;
	const { user } = useUser<IHomeOwnerEntity>();
	const { setSelectedJob } = useJobContext();
	const [isRefresh, setIsRefresh] = useState(false);
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["jobs", JobStatus.closed],
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		enabled: !!user?.uid,
		queryFn: () => fetchJobsWithBidsByStatus(user!.uid, [JobStatus.closed, JobStatus.completed]),
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
				<ORHomeownerJobListing
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
