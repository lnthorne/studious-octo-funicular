import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useJobContext } from "@/contexts/jobContext";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import GeneralModal from "@/components/generalModal";
import ORJobDetails from "@/components/organisms/JobDetails";
import { Colors } from "react-native-ui-lib";
import ORMap from "@/components/organisms/Map";
import { MLButton } from "@/components/molecules/Button";
import BottomSheet from "@gorhom/bottom-sheet";
import BidBottomSheet from "@/components/BottomSheetBid";

export default function JobDetailsPage() {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { user } = useUser<IHomeOwnerEntity>();
	const { selectedJob } = useJobContext();
	const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const handleModalClose = () => {
		setModalVisible(false);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor, paddingVertical: 40 }}>
			<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
				<ORJobDetails jobDetails={selectedJob} />
				<ORMap lat={selectedJob!.lat} lng={selectedJob!.lng} />
				<MLButton label="Apply for this job" onPress={() => {}} style={styles.button} />
			</ScrollView>
			<GeneralModal
				visible={modalVisible}
				description="Are you sure you want to mark this job as completed? You cannot undo this action."
				onDone={handleModalClose}
				onCancel={handleModalClose}
			/>
			<BidBottomSheet onSubmit={(t) => console.log(t)} ref={bottomSheetRef} />
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
