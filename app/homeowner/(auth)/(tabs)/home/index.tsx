// app/home/index.tsx
import { useUser } from "@/contexts/userContext";
import { cancelJobPosting, fetchJobsWithBidsByStatus } from "@/services/post";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, SafeAreaView, StyleSheet, View } from "react-native";
import ORJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "@/app/design-system/designSystem";
import { SkeletonView } from "react-native-ui-lib";

export default function HomeScreen() {
	const opacity = useRef(new Animated.Value(0)).current;
	const queryClient = useQueryClient();
	const { user } = useUser<IHomeOwnerEntity>();
	const { setSelectedJob } = useJobContext();
	const [isRefresh, setIsRefresh] = useState(false);
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["jobs", JobStatus.open],
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		enabled: !!user?.uid,
		queryFn: () => fetchJobsWithBidsByStatus(user!.uid, [JobStatus.open]),
	});

	const {
		mutate,
		isError: isJobDeletionError,
		isPending: isJobDeletionPending,
	} = useMutation({
		mutationFn: async (selectedJob: IPostEntity) => cancelJobPosting(selectedJob),
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

	const handleLongPress = (selectedJob: IPostEntity) => {
		Alert.alert(
			"Delete Job",
			"Are you sure you want to delete this job?",
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", style: "destructive", onPress: () => handleJobDeletion(selectedJob) },
			],
			{ cancelable: true }
		);
	};

	const handleJobDeletion = async (selectedJob: IPostEntity) => {
		mutate(selectedJob, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["jobs", JobStatus.open], refetchType: "all" });
			},
			onError: () => {
				Alert.alert("There was an error deleting your job.");
			},
		});
	};

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
			{isLoading && (
				<SkeletonView showContent={false} template={SkeletonView.templates.LIST_ITEM} times={9} />
			)}
			<Animated.View style={[{ flex: 1 }, { opacity }]}>
				<ORJobListing
					data={data || []}
					isRefresh={isRefresh}
					onRefresh={onRefresh}
					onPress={handleJobSelection}
					onLongPress={handleLongPress}
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
