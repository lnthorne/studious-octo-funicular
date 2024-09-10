import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { subscribeToMessages, sendMessage, markMessageAsRead } from "@/services/messaging"; // Your service
import { IMessage, IMessageEntity, MessageType } from "@/typings/messaging.inter";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";

export default function MessagesPage() {
	const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
	const [messages, setMessages] = useState<IMessageEntity[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser<IHomeOwnerEntity>();

	useEffect(() => {
		if (!conversationId || !user) return;
		const unsubscribe = subscribeToMessages(conversationId, (newMessages) => {
			setMessages((prevMessages) => [...prevMessages, ...newMessages]);

			newMessages.forEach((message) => {
				if (!message.readBy || !message.readBy[user.uid]) {
					markMessageAsRead(conversationId, message.messageId, user.uid);
				}
			});
		});
		return () => unsubscribe();
	}, [conversationId]);

	const handleSendMessage = async () => {
		if (!newMessage.trim() || !user) return;

		const message: IMessage = {
			body: newMessage,
			senderId: user.uid,
			messageType: MessageType.TEXT,
		};
		try {
			await sendMessage(conversationId, message);
			setNewMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>
				<FlatList
					data={messages}
					keyExtractor={(item) => new Date(item.timestamp).getTime().toString()}
					renderItem={({ item }) => (
						<View
							style={[
								styles.messageBubble,
								item.senderId === user?.uid ? styles.userMessage : styles.otherMessage,
							]}
						>
							<Text>{item.body}</Text>
							<Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
						</View>
					)}
				/>

				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={newMessage}
						onChangeText={setNewMessage}
						placeholder="Type your message..."
					/>
					<Button title="Send" onPress={handleSendMessage} />
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	messageBubble: {
		padding: 10,
		borderRadius: 8,
		marginVertical: 5,
		maxWidth: "75%",
	},
	userMessage: {
		backgroundColor: "#6200ee",
		alignSelf: "flex-end",
		color: "#fff",
	},
	otherMessage: {
		backgroundColor: "#e0e0e0",
		alignSelf: "flex-start",
	},
	timestamp: {
		fontSize: 10,
		color: "#999",
		textAlign: "right",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		borderTopWidth: 1,
		borderColor: "#ddd",
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 20,
		paddingHorizontal: 10,
		marginRight: 10,
		height: 40,
	},
});
