import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { startNewConversation } from "@/services/messaging"; // Import the service
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";

export default function NewConversationPage() {
	const [recipientId, setRecipientId] = useState("");
	const [initialMessage, setInitialMessage] = useState("");
	const { user } = useUser<IHomeOwnerEntity>(); // Get the current user

	const handleStartConversation = async () => {
		if (!user) return;
		if (!recipientId) {
			Alert.alert("Error", "Please enter a recipient ID.");
			return;
		}

		try {
			const conversationId = await startNewConversation(user.uid, recipientId, initialMessage);

			// Navigate to the new conversation
			router.push(`/homeowners/messages/${conversationId}`);
		} catch (error) {
			Alert.alert("Error", "Failed to start a new conversation.");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<TextInput
					style={styles.input}
					placeholder="Enter recipient ID"
					value={recipientId}
					onChangeText={setRecipientId}
				/>

				<TextInput
					style={[styles.input, styles.messageInput]}
					placeholder="Enter your message (optional)"
					value={initialMessage}
					onChangeText={setInitialMessage}
					multiline={true}
				/>

				<Button title="Start Conversation" onPress={handleStartConversation} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 12,
		paddingVertical: 30,
		paddingHorizontal: 17,
		marginBottom: 15,
		marginHorizontal: 16,
	},
	messageInput: {
		height: 100,
		textAlignVertical: "top",
	},
});
