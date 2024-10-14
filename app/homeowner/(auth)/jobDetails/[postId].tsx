import {
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
	checkAndClosePostingAndBid,
	fetchInProgressPost,
	updatePostCompletionStatus,
} from "@/services/post";
import { IPostEntity } from "@/typings/jobs.inter";
import GeneralModal from "@/components/generalModal";
import ORJobDetails from "@/components/organisms/JobDetails";

export default function JobDetails() {
	const { postId } = useLocalSearchParams<{ postId: string }>();
	const [jobData, setJobData] = useState<IPostEntity | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [isCompanyCompletionPending, setIsCompanyCompletionPending] = useState(true);

	const handleJobCompleted = async () => {
		if (!jobData || !jobData.winningBidId) return;
		try {
			await updatePostCompletionStatus(postId, jobData.uid);
			await checkAndClosePostingAndBid(postId, jobData.winningBidId);
		} catch (error) {
			console.error("Failed to update job status:", error);
			setError("Failed to update job status");
			setModalVisible(false);
		} finally {
			setModalVisible(false);
			router.back();
		}
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};

	const fetchPostData = async () => {
		if (!postId) return;

		setLoading(true);
		try {
			const jobDetails = await fetchInProgressPost(postId);
			if (jobDetails) {
				setJobData(jobDetails);
			} else {
				console.error("Job not found or no in-progress job with the provided ID");
				setError("Job not found or no in-progress job with the provided ID");
			}
		} catch (error) {
			console.error("Failed to fetch post data:", error);
			setError("Failed to fetch post data");
		} finally {
			setLoading(false);
		}
	};

	const hasCompanyCompletedJob = () => {
		if (!jobData || !jobData.bids) return false;
		const companyId = jobData.bids[0].uid;
		return jobData.completionConfirmed[companyId];
	};

	useEffect(() => {
		fetchPostData();
	}, [postId]);

	useEffect(() => {
		setIsCompanyCompletionPending(!hasCompanyCompletedJob());
	}, [jobData]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#007BFF" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	return (
		<SafeAreaView>
			<ScrollView contentContainerStyle={styles.container}>
				<ORJobDetails jobDetails={jobData} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		color: "#FF0000",
		fontSize: 16,
		textAlign: "center",
	},
	container: {
		paddingHorizontal: 20,
	},
});
