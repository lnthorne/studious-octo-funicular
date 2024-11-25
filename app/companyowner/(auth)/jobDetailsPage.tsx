import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useJobContext } from "@/contexts/jobContext";
import { useUser } from "@/contexts/userContext";
import { ICompanyOwnerEntity, IHomeOwnerEntity } from "@/typings/user.inter";
import GeneralModal from "@/components/generalModal";
import ORJobDetails from "@/components/organisms/JobDetails";
import { Colors } from "react-native-ui-lib";
import ORMap from "@/components/organisms/Map";
import { MLButton } from "@/components/molecules/Button";
import BottomSheet from "@gorhom/bottom-sheet";
import BidBottomSheet from "@/components/BottomSheetBid";
import { IBid } from "@/typings/jobs.inter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitBid } from "@/services/bid";
import { router } from "expo-router";

export default function JobDetailsPage() {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { user } = useUser<ICompanyOwnerEntity>();
	const { selectedJob } = useJobContext();
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const queryClient = useQueryClient();
	const { mutate, isError } = useMutation({
		mutationFn: (newBid: IBid) => {
			return submitBid(newBid);
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
				queryClient.invalidateQueries({ queryKey: ["posts", user?.uid], refetchType: "all" });
				setBottomSheetVisible(false);
				bottomSheetRef.current?.close();
				router.back();
			},
			onError: () => {
				Alert.alert("There was an error submitting bid. Try again.");
			},
		});
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor, paddingVertical: 40 }}>
			<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
				<ORJobDetails jobDetails={selectedJob} />
				<ORMap lat={selectedJob!.lat} lng={selectedJob!.lng} />
				<MLButton
					label="Apply for this job"
					onPress={() => handleCreateBid()}
					style={styles.button}
				/>
			</ScrollView>
			<GeneralModal
				visible={modalVisible}
				description="Are you sure you want to mark this job as completed? You cannot undo this action."
				onDone={handleModalClose}
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
		marginTop: 25,
		marginHorizontal: 0,
	},
});
