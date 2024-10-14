// app/home/index.tsx
import { useUser } from "@/contexts/userContext";
import { fetchJobsWithBidsByStatus } from "@/services/post";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import ORHomeownerJobListing from "@/components/organisms/HomeownerJobListing";

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
		<ORHomeownerJobListing
			data={jobsWithBids}
			isRefresh={isRefresh}
			onRefresh={onRefresh}
			chipLabel="View Bids"
		/>
	);
}
