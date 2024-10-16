import { ActivityIndicator, SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { checkAndClosePostingAndBid, updatePostCompletionStatus } from "@/services/post";
import { IPostEntity } from "@/typings/jobs.inter";
import ORJobDetails from "@/components/organisms/JobDetails";
import ORBidList from "@/components/organisms/BidList";
import { useJobContext } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";

export default function JobDetails() {
	const { selectedJob } = useJobContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [isCompanyCompletionPending, setIsCompanyCompletionPending] = useState(true);

	const handleJobCompleted = async () => {
		if (!selectedJob || !selectedJob.winningBidId) return;
		try {
			await updatePostCompletionStatus(selectedJob.pid, selectedJob.uid);
			await checkAndClosePostingAndBid(selectedJob.pid, selectedJob.winningBidId);
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

	const hasCompanyCompletedJob = () => {
		if (!selectedJob || !selectedJob.bids) return false;
		const companyId = selectedJob.bids[0].uid;
		return selectedJob.completionConfirmed[companyId];
	};

	useEffect(() => {
		setIsCompanyCompletionPending(!hasCompanyCompletedJob());
	}, [selectedJob]);

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
				<ATText typography="error" color="error">
					{error}
				</ATText>
			</View>
		);
	}

	return (
		<SafeAreaView>
			<FlatList
				data={selectedJob?.bids}
				keyExtractor={(item) => item.bid}
				renderItem={({}) => <ORBidList bids={selectedJob?.bids} />}
				ListHeaderComponent={<ORJobDetails jobDetails={selectedJob} />}
				contentContainerStyle={styles.container}
				ListEmptyComponent={
					<ATText typography="secondaryText" color="secondaryTextColor" style={styles.listEmpty}>
						You have not recieved any bids...
					</ATText>
				}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	listEmpty: {
		paddingBottom: 10,
		alignSelf: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	container: {
		paddingHorizontal: 20,
	},
});
