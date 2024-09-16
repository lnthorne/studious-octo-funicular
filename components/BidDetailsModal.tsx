import {
	ActivityIndicator,
	Alert,
	Button,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { acceptBidAndCloseOtherBids, fetchBidFromBid } from "@/services/bid";
import { IBidEntity } from "@/typings/jobs.inter";
import { router } from "expo-router";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { useUser } from "@/contexts/userContext";
import { startNewConversation } from "@/services/messaging";

interface BidDetailsModalProps {
	bid: string | null;
	visible: boolean;
	onClose: (isRefresh?: boolean) => void;
}
export default function BidDetailsModal({ bid, visible, onClose }: BidDetailsModalProps) {
	const { user } = useUser<IHomeOwnerEntity>();
	const [bidDetails, setBidDetails] = useState<IBidEntity | null>(null);

	useEffect(() => {
		const fetchBidDetails = async () => {
			if (bid) {
				try {
					const bidData = await fetchBidFromBid(bid);
					setBidDetails(bidData);
				} catch (error) {
					console.error("Error fetching bid details", error);
				}
			}
		};
		fetchBidDetails();
	}, [bid]);

	const handleAcceptBid = async () => {
		if (!bidDetails) return;

		try {
			await acceptBidAndCloseOtherBids(bidDetails.bid, bidDetails.pid, bidDetails.uid);
			Alert.alert("Bid accepted successfully!");
			onClose(true);
		} catch (error) {
			console.error("Failed to accept bid:", error);
			Alert.alert("Failed to accept bid. Please try again.");
		}
	};

	const handleCreateConversation = async () => {
		if (!user || !bidDetails) {
			Alert.alert("Error", "Please try again.");
			return;
		}
		try {
			const conversationId = await startNewConversation(user.uid, bidDetails.uid);
			onClose();
			router.navigate(`/shared/messages/${conversationId}`);
		} catch (error) {
			console.error("Error creating conversation:", error);
			Alert.alert("Error creating conversation. Please try again.");
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={() => onClose()}
		>
			<TouchableWithoutFeedback onPress={() => onClose()}>
				<View style={styles.modalContainer}>
					<Pressable style={styles.modalContent}>
						<Text style={styles.modalTitle}>Bid Details</Text>
						{bidDetails ? (
							<>
								<Text>Company Name: {bidDetails.companyName}</Text>
								<Text>Bid Amount: ${bidDetails.bidAmount}</Text>
								<Text>Description: {bidDetails.description}</Text>
							</>
						) : (
							<ActivityIndicator size={"large"} />
						)}

						<View style={styles.buttonContainer}>
							<Button title="Accept Bid" onPress={handleAcceptBid} />
							<Button title="Send Message" onPress={handleCreateConversation} />
							<Button title="Cancel" onPress={() => onClose()} />
						</View>
					</Pressable>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	buttonContainer: {
		marginTop: 20,
	},
});
