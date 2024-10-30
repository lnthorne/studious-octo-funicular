import { ActivityIndicator, SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { checkAndClosePostingAndBid, updatePostCompletionStatus } from "@/services/post";
import { IBidEntity, IPostEntity, JobStatus } from "@/typings/jobs.inter";
import ORJobDetails from "@/components/organisms/JobDetails";
import ORBidList from "@/components/organisms/BidList";
import { useJobContext } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";
import { MLButton } from "@/components/molecules/Button";
import GeneralModal from "@/components/generalModal";
import ReviewBottomSheet from "@/components/ReviewBottomSheet";

export default function JobDetails() {
	const { selectedJob, setSelectedBid } = useJobContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [bottomSheetVisible, setBottomSheetVisible] = useState(true);
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

	const handleButtonType = () => {
		if (selectedJob?.jobStatus === JobStatus.inprogress) {
			const label = isCompanyCompletionPending ? "In Progress" : "Job Complete";
			return (
				<>
					<MLButton
						disabled={isCompanyCompletionPending}
						label={label}
						onPress={() => setModalVisible(true)}
						style={{ marginVertical: 0 }}
					/>
					{isCompanyCompletionPending && (
						<ATText
							typography="secondaryText"
							color="secondaryTextColor"
							style={styles.buttonDisclaimer}
						>
							Job completion must first be confirmed by the landscaper.
						</ATText>
					)}
				</>
			);
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

	const handleBidSelected = (selectedBid: IBidEntity) => {
		setSelectedBid(selectedBid);
		router.navigate("/homeowner/bidDetailsPage");
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
				renderItem={({}) => <ORBidList bids={selectedJob?.bids} onPress={handleBidSelected} />}
				ListHeaderComponent={<ORJobDetails jobDetails={selectedJob} />}
				ListFooterComponent={handleButtonType}
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<ATText typography="secondaryText" color="secondaryTextColor" style={styles.listEmpty}>
						You have not recieved any bids...
					</ATText>
				}
			/>
			<GeneralModal
				visible={modalVisible}
				description="Are you sure you want to mark this job as completed? You cannot undo this action."
				onDone={handleJobCompleted}
				onCancel={handleModalClose}
			/>
			<ReviewBottomSheet
				visible={bottomSheetVisible}
				onClose={() => setBottomSheetVisible(false)}
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
	buttonDisclaimer: {
		alignSelf: "center",
		textAlign: "center",
	},
});
