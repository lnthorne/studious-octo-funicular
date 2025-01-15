import { Alert, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useJobContext } from "@/contexts/jobContext";
import { useUser } from "@/contexts/userContext";
import { ICompanyOwnerEntity } from "@/typings/user.inter";
import GeneralModal from "@/components/generalModal";
import ORJobDetails from "@/components/organisms/JobDetails";
import ORMap from "@/components/organisms/Map";
import { MLButton } from "@/components/molecules/Button";
import BottomSheet from "@gorhom/bottom-sheet";
import BidBottomSheet from "@/components/BottomSheetBid";
import { BidStatus, IBid, IBidEntity, JobStatus } from "@/typings/jobs.inter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitBid, updateBidStatus } from "@/services/bid";
import { router } from "expo-router";
import MyBid from "@/components/MyBid";
import { Colors } from "@/app/design-system/designSystem";
import { updatePostCompletionStatus } from "@/services/post";
import useAnimation from "@/hooks/useAnimation";

export default function JobDetailsPage() {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { user } = useUser<ICompanyOwnerEntity>();
	const { startAnimation } = useAnimation();
	const { selectedJob, bids } = useJobContext();
	const [selectedBid, setSelectedBid] = useState<IBidEntity>();
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [mapVisible, setMapVisible] = useState(true);
	const queryClient = useQueryClient();
	const videoSource = require("../../../assets/splash/bidSent.mp4");
	const { mutate, isError } = useMutation({
		mutationFn: (newBid: IBid) => {
			return submitBid(newBid, user?.profileImage);
		},
	});
	const { mutate: mutateJobStatus } = useMutation({
		mutationFn: async ({ pid, uid }: { pid: string; uid: string }) => {
			if (selectedBid) {
				await updateBidStatus(selectedBid.bid, BidStatus.waiting);
				return updatePostCompletionStatus(pid, uid);
			}
		},
	});

	const initialBidValue: IBid = {
		bidAmount: 0,
		companyName: user!.companyName,
		description: "",
		pid: selectedJob!.pid,
		uid: user!.uid,
		date: new Date(),
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};

	const handleCreateBid = () => {
		setBottomSheetVisible(true);
		bottomSheetRef.current?.snapToIndex(0);
	};

	const handleSubmitBid = (bid: IBid) => {
		mutate(bid, {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["bids", user?.uid, BidStatus.pending],
					refetchType: "all",
				});
				queryClient.invalidateQueries({ queryKey: ["posts", user?.uid], refetchType: "all" });
				setBottomSheetVisible(false);
				bottomSheetRef.current?.close();
				startAnimation(videoSource, () => {
					router.back();
				});
			},
			onError: () => {
				Alert.alert("There was an error submitting bid. Try again.");
			},
		});
	};

	const handleJobComplete = () => {
		setModalVisible(false);
		if (selectedJob && user) {
			mutateJobStatus(
				{ pid: selectedJob.pid, uid: user.uid },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({
							queryKey: ["jobPosts", user?.uid],
							refetchType: "all",
						});
						queryClient.invalidateQueries({
							queryKey: ["bids", user?.uid, [BidStatus.accepted, BidStatus.waiting]],
							refetchType: "all",
						});

						selectedBid!.status = BidStatus.waiting;

						router.back();
					},
					onError: () => {
						Alert.alert("There was an error updating job status. Try again.");
					},
				}
			);
		}
	};

	useEffect(() => {
		if (selectedJob?.lat === 90 && selectedJob.lng === -90) {
			setMapVisible(false);
		}
		const myBid = bids.find((myBid) => selectedJob?.bidIds?.some((jobBid) => jobBid === myBid.bid));
		setSelectedBid(myBid);
	}, [selectedJob]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor, paddingVertical: 40 }}>
			<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
				<ORJobDetails jobDetails={selectedJob} />
				{mapVisible && <ORMap lat={selectedJob!.lat} lng={selectedJob!.lng} />}
				{selectedBid && <MyBid bid={selectedBid} />}
			</ScrollView>
			{!selectedBid && (
				<MLButton
					label="Apply for this job"
					onPress={() => handleCreateBid()}
					style={styles.button}
				/>
			)}
			{selectedBid && selectedJob?.jobStatus === JobStatus.inprogress && (
				<MLButton
					label="Job completed"
					onPress={() => setModalVisible(true)}
					style={styles.button}
					disabled={selectedBid.status === BidStatus.waiting}
				/>
			)}
			<GeneralModal
				visible={modalVisible}
				description="You have marked this job as completed, but it will stay in progress until the homeowner also marks it as complete."
				onDone={handleJobComplete}
				onCancel={handleModalClose}
			/>
			<BidBottomSheet
				onSubmit={handleSubmitBid}
				ref={bottomSheetRef}
				initialValues={initialBidValue}
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
	container: {
		paddingHorizontal: 20,
	},
	button: {
		marginTop: 15,
		marginHorizontal: 16,
	},
});
