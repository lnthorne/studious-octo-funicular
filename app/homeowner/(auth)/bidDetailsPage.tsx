import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useJobContext } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { startNewConversation } from "@/services/messaging";
import { router } from "expo-router";
import { MLButton } from "@/components/molecules/Button";

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
	return (
		<SafeAreaView>
			<Text>bidDetailsPage</Text>
			<ATText>{selectedBid?.companyName}</ATText>
			<MLButton label="Start Conversation" onPress={handleCreateConversation} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({});
