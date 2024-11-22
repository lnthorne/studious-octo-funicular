import { ActivityIndicator, SafeAreaView, StyleSheet, View, ScrollView, Alert } from "react-native";
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
import ReviewBottomSheet from "@/components/BottomSheetReview";
import { IReview, ReviewForm } from "@/typings/reviews.inter";
import { Close } from "./_layout";
import { CreateReview } from "@/services/review";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Colors } from "@/app/design-system/designSystem";

export default function JobDetails() {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const navigationOptions = useNavigation();
	const queryClient = useQueryClient();
	const { user } = useUser<IHomeOwnerEntity>();
	const { selectedJob, setSelectedBid } = useJobContext();
	const [modalVisible, setModalVisible] = useState(false);
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [isCompanyCompletionPending, setIsCompanyCompletionPending] = useState(true);
	const { mutate } = useMutation({
		mutationFn: async ({
			pid,
			uid,
			winningBidId,
		}: {
			pid: string;
			uid: string;
			winningBidId: string;
		}) => {
			await updatePostCompletionStatus(pid, uid);
			await checkAndClosePostingAndBid(pid, winningBidId);
		},
	});

	const { mutate: reviewMutate } = useMutation({
		mutationFn: async (data: IReview) => {
			await CreateReview(data);
		},
	});

	const handleJobCompleted = async () => {
		if (!selectedJob || !selectedJob.winningBidId) return;
		mutate(
			{
				pid: selectedJob.pid,
				uid: selectedJob.uid,
				winningBidId: selectedJob.winningBidId,
			},
			{
				onSuccess: () => {
					setModalVisible(false); // Close modal
					setBottomSheetVisible(true); // Open bottom sheet
					bottomSheetRef.current?.snapToIndex(0); // Snap bottom sheet
					queryClient.invalidateQueries({ queryKey: ["jobs", JobStatus.inprogress] });
					queryClient.invalidateQueries({ queryKey: ["jobs", JobStatus.closed] });
				},
				onError: () => {
					setModalVisible(false); // Ensure modal closes on error
					Alert.alert("Failed to complete job. Please try again");
				},
			}
		);
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

		reviewMutate(data, {
			onError: () => {
				Alert.alert("Failed to post review.");
			},
		});
		setBottomSheetVisible(false);
		bottomSheetRef.current?.close();
		router.back();
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

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor, paddingVertical: 40 }}>
			<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
				<ORJobDetails jobDetails={selectedJob} />
				{selectedJob?.bids ? (
					<ORBidList bids={selectedJob.bids} onPress={handleBidSelected} />
				) : (
					<ATText typography="secondaryText" color="secondaryTextColor" style={styles.listEmpty}>
						You have not received any bids...
					</ATText>
				)}
				{handleButtonType()}
			</ScrollView>
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
	container: {
		paddingHorizontal: 20,
	},
	buttonDisclaimer: {
		alignSelf: "center",
		textAlign: "center",
	},
});
