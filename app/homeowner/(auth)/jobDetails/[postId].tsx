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
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Job Details</Text>
					<Text style={styles.label}>Title:</Text>
					<Text style={styles.value}>{jobData?.title}</Text>
					<Text style={styles.label}>Description:</Text>
					<Text style={styles.value}>{jobData?.description}</Text>
					<Text style={styles.label}>Status:</Text>
					<Text style={styles.value}>{jobData?.jobStatus}</Text>
					{jobData?.imageUrls?.map((url, index) => {
						return <Image source={{ uri: url }} style={styles.image} key={index} />;
					})}
				</View>
				{jobData?.bids?.map((bid, index) => (
					<View style={styles.section} key={index}>
						<Text style={styles.sectionTitle}>{bid.companyName}'s bid</Text>
						<Text style={styles.label}>Amount:</Text>
						<Text style={styles.value}>${bid.bidAmount}</Text>
						<Text style={styles.label}>Bid Description:</Text>
						<Text style={styles.value}>{bid.description}</Text>
						<Text style={styles.label}>Status:</Text>
						<Text style={styles.value}>{bid.status}</Text>
					</View>
				))}
				{isCompanyCompletionPending && (
					<Text style={styles.errorText}>Company has not marked the job as completed yet.</Text>
				)}
				<Button
					title={"Job Completed"}
					onPress={() => setModalVisible(true)}
					disabled={isCompanyCompletionPending}
				/>
				<GeneralModal
					visible={modalVisible}
					description="Are you sure you want to mark this job as completed? You cannot undo this action."
					onDone={handleJobCompleted}
					onCancel={handleModalClose}
				/>
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
		padding: 20,
		backgroundColor: "#F5F5F5",
	},
	section: {
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		padding: 15,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333333",
	},
	label: {
		fontSize: 16,
		color: "#555555",
		marginTop: 10,
	},
	value: {
		fontSize: 16,
		color: "#000000",
		marginBottom: 5,
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		marginTop: 10,
	},
});
