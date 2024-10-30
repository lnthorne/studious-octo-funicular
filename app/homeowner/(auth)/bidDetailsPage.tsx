import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useJobContext } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { startNewConversation } from "@/services/messaging";
import { router } from "expo-router";
import { MLButton } from "@/components/molecules/Button";
import { Colors } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { acceptBidAndCloseOtherBids } from "@/services/bid";

export default function bidDetailsPage() {
	const { selectedBid } = useJobContext();
	const { user } = useUser<IHomeOwnerEntity>();

	const handleCreateConversation = async () => {
		if (!user || !selectedBid) {
			Alert.alert("Error", "Please try again.");
			return;
		}
		try {
			const conversationId = await startNewConversation(user.uid, selectedBid.uid);
			// TODO: figure out name stuff
			router.navigate({
				pathname: "/shared/messages/[conversationId]",
				params: {
					conversationId,
					name: "John Doe",
				},
			});
		} catch (error) {
			console.error("Error creating conversation:", error);
			Alert.alert("Error creating conversation. Please try again.");
		}
	};

	const handleAcceptBid = async () => {
		if (!selectedBid) return;

		try {
			await acceptBidAndCloseOtherBids(selectedBid.bid, selectedBid.pid, selectedBid.uid);
			Alert.alert("Bid accepted successfully!");
			router.back();
		} catch (error) {
			console.error("Failed to accept bid:", error);
			Alert.alert("Failed to accept bid. Please try again.");
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<ATText>{selectedBid?.companyName}</ATText>
			<View style={styles.subHeader}>
				<ATText typography="subheading">Message Bidder</ATText>
			</View>
			<TouchableOpacity style={styles.row}>
				<ATText typography="textBoxText" style={{ flexDirection: "column" }}>
					Start a conversation with Liam
				</ATText>
				<Ionicons name="send" size={24} style={{ flexDirection: "column" }} />
			</TouchableOpacity>
			<MLButton label="Start Conversation" onPress={handleCreateConversation} />
			<MLButton label="Accept Bid" onPress={handleAcceptBid} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	subHeader: {
		paddingHorizontal: 16,
		alignItems: "flex-start",
		alignSelf: "stretch",
	},
	row: {
		flexDirection: "row",
		height: 56,
		paddingHorizontal: 16,
		justifyContent: "space-between",
		alignItems: "center",
		alignSelf: "stretch",
	},
});
