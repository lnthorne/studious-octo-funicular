import { ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { useFocusEffect } from "expo-router";
import ORHomeownerJobListing from "@/components/organisms/HomeownerJobListing";

export default function closedJobs() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [closedJobs, setClosedJobs] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);
	const [isRefresh, setIsRefresh] = useState(false);

	const fetchClosedJobs = async (isRefreshing: boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, [JobStatus.completed]);
			setClosedJobs(jobs);
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

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}

	return (
		<ORHomeownerJobListing
			data={closedJobs}
			isRefresh={isRefresh}
			onRefresh={onRefresh}
			chipLabel="View"
		/>
	);
}
