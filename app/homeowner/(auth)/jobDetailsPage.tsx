import { ActivityIndicator, SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";
import { checkAndClosePostingAndBid, updatePostCompletionStatus } from "@/services/post";
import { IBidEntity, JobStatus } from "@/typings/jobs.inter";
import ORJobDetails from "@/components/organisms/JobDetails";
import ORBidList from "@/components/organisms/BidList";
import { useJobContext } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";
import { MLButton } from "@/components/molecules/Button";
import GeneralModal from "@/components/generalModal";
import BottomSheet from "@gorhom/bottom-sheet";
import ReviewBottomSheet from "@/components/Test";
import { IReview, ReviewForm } from "@/typings/reviews.inter";
import { Close } from "./_layout";
import { CreateReview } from "@/services/review";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";

export default function JobDetails() {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const navigationOptions = useNavigation();
	const { user } = useUser<IHomeOwnerEntity>();
	const { selectedJob, setSelectedBid } = useJobContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
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
			setBottomSheetVisible(true);
			bottomSheetRef.current?.snapToIndex(0);
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

	const handleReviewSubmit = async (reviewData: ReviewForm) => {
		if (!selectedJob || !selectedJob.bids || !user) {
			setBottomSheetVisible(false);
			bottomSheetRef.current?.close();
			router.back();
			return;
		}
		const data: IReview = {
			...reviewData,
			homeownerId: user.uid,
			homeownerFirstName: user.firstname,
			homeownerLastName: user.lastname,
			companyOwnerId: selectedJob.bids[0].uid,
		};

		try {
			await CreateReview(data);
		} catch (error) {
			console.error("There was an error submitting review", error);
		} finally {
			setBottomSheetVisible(false);
			bottomSheetRef.current?.close();
			router.back();
		}
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

	useEffect(() => {
		if (bottomSheetVisible) {
			navigationOptions.setOptions({
				headerRight: () => <Close isDisabled={true} />,
				gestureEnabled: !bottomSheetVisible,
			});
		}
	}, [bottomSheetVisible]);

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
			<ReviewBottomSheet onSubmit={handleReviewSubmit} ref={bottomSheetRef} />
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
