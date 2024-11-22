import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TextInput,
	Button,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { subscribeToMessages, sendMessage, markMessageAsRead } from "@/services/messaging"; // Your service
import { IMessage, IMessageEntity, MessageType } from "@/typings/messaging.inter";
import { useUser } from "@/contexts/userContext";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "@/app/design-system/designSystem";

export default function MessagesPage() {
	const { conversationId } = useLocalSearchParams<{ conversationId: string; name: string }>();
	const [messages, setMessages] = useState<IMessageEntity[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const flatListRef = useRef<FlatList<IMessageEntity>>(null);

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

	const formatMessageDate = (timestamp: number): string => {
		const messageDate = new Date(timestamp);
		const today = new Date();

		// Check if the date is today
		const isToday =
			messageDate.getDate() === today.getDate() &&
			messageDate.getMonth() === today.getMonth() &&
			messageDate.getFullYear() === today.getFullYear();

		if (isToday) {
			// If today, return the time in the format "HH:MM AM/PM"
			return messageDate.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
			});
		} else {
			// Otherwise, return the date in the format "MM/DD/YY"
			return `${messageDate.getMonth() + 1}/${messageDate.getDate()}/${messageDate
				.getFullYear()
				.toString()
				.slice(-2)}`;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
			>
				<FlatList
					data={messages}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => new Date(item.timestamp).getTime().toString()}
					ref={flatListRef}
					onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
					onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
					keyboardDismissMode="on-drag"
					renderItem={({ item }) => (
						<View style={styles.messageContainer}>
							<View
								style={[
									styles.messageBubble,
									item.senderId === user?.uid ? styles.userMessage : styles.otherMessage,
								]}
								key={item.messageId}
							>
								<ATText typography="messageText">{item.body}</ATText>
							</View>
							<Text
								style={item.senderId === user?.uid ? styles.userTimestamp : styles.otherTimestamp}
							>
								{formatMessageDate(item.timestamp)}
							</Text>
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
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		justifyContent: "flex-end",
		backgroundColor: Colors.backgroundColor,
	},
	heading: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		marginBottom: 27,
	},
	backBtn: {
		position: "absolute",
		left: 16,
		zIndex: 1,
	},
	backIcon: {
		width: 24,
		height: 24,
		marginTop: 28,
	},
	messageContainer: {
		paddingVertical: 2,
	},
	messageBubble: {
		padding: 10,
		borderRadius: 8,
		marginVertical: 5,
		maxWidth: "75%",
	},
	userMessage: {
		backgroundColor: Colors.primaryButtonColor,
		alignSelf: "flex-end",
		color: "#fff",
	},
	otherMessage: {
		backgroundColor: Colors.secondaryButtonColor,
		alignSelf: "flex-start",
	},
	userTimestamp: {
		fontSize: 10,
		color: Colors.timestamp,
		textAlign: "right",
	},
	otherTimestamp: {
		fontSize: 10,
		color: Colors.timestamp,
		textAlign: "left",
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
