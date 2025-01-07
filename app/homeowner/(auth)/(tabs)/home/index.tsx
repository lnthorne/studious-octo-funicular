// app/home/index.tsx
import { useUser } from "@/contexts/userContext";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, SafeAreaView, StyleSheet, View } from "react-native";
import ORJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { useQuery } from "@tanstack/react-query";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "@/app/design-system/designSystem";
import { SkeletonView } from "react-native-ui-lib";

export default function HomeScreen() {
	const opacity = useRef(new Animated.Value(0)).current;
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
