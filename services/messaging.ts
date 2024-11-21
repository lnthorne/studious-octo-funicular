import database from "@react-native-firebase/database";
import { IMessage, IConversation, MessageType, IMessageEntity } from "@/typings/messaging.inter";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

/**
 * Fetch a user's conversations from the Firebase Realtime Database.
 * @param userId - The ID of the user to fetch conversations for.
 * @param onConversationsUpdate - Callback to handle updates to conversations.
 */
export function subscribeToConversations(
	userId: string,
	onConversationsUpdate: (conversations: IConversation[]) => void
) {
	const ref = database().ref(`conversations`);

	// Listen for updates to the user's conversations
	const listener = ref
		.orderByChild(`members/${userId}`)
		.equalTo(true)
		.on("value", (snapshot) => {
			const conversationsData = snapshot.val();
			const conversations: IConversation[] = [];

			if (conversationsData) {
				for (const conversationId in conversationsData) {
					const conversation = conversationsData[conversationId];
					// Only include conversations where the user is a member
					if (conversation.members[userId]) {
						conversations.push(conversation);
					}
				}
			}

			onConversationsUpdate(conversations);
		});

	// Unsubscribe from the listener when done
	return () => ref.off("value", listener);
}

/**
 * Subscribe to messages in a conversation.
 * @param conversationId - The ID of the conversation to listen for messages.
 * @param onMessagesUpdate - Callback to handle new or updated messages.
 */
export function subscribeToMessages(
	conversationId: string,
	onMessagesUpdate: (messages: IMessageEntity[]) => void
) {
	const ref = database().ref(`messages/${conversationId}`);

	// Listen for new messages or changes to messages
	const listener = ref.on("child_added", (snapshot) => {
		const messageData = snapshot.val();
		const message: IMessageEntity = {
			...messageData,
		};

		onMessagesUpdate([message]); // Send back the new message
	});

	// Unsubscribe when done
	return () => ref.off("child_added", listener);
}

/**
 * Send a new message in a conversation. Then update the conversation's last message.
 * @param conversationId - The ID of the conversation.
 * @param message - The message to send.
 */
export async function sendMessage(conversationId: string, message: IMessage) {
	const messageRef = database().ref(`messages/${conversationId}`).push();
	const conversationRef = database().ref(`conversations/${conversationId}`);
	try {
		await messageRef.set({
			...message,
			messageId: messageRef.key!,
			timestamp: Date.now(),
			readBy: {
				[message.senderId]: true,
			},
		});

		await conversationRef.update({
			lastMessage: message.body,
			lastMessageTimestamp: Date.now(),
			lastSenderId: message.senderId,
		});
	} catch (error) {
		throw error;
	}
}

/**
 * Check if two users are in a conversation together.
 * @param userId1 - The ID of the first user.
 * @param userId2 - The ID of the second user.
 * @returns True if the users are in a conversation together, false otherwise.
 */
async function areUsersInConversationTogether(
	userId1: string,
	userId2: string
): Promise<string | null> {
	const conversationRef = database().ref("conversations");
	const snapshot = await conversationRef.once("value");
	const conversations = snapshot.val();

	for (const conversationId in conversations) {
		const members = conversations[conversationId].members;
		if (members[userId1] && members[userId2]) {
			return conversationId;
		}
	}
	return null;
}

/**
 * Calls areUsersInConversationTogether to check if a conversation exists, if not,
 * creates a new conversation between two users in Realtime Database.
 * @param senderId - The ID of the user starting the conversation.
 * @param recipientId - The ID of the other participant in the conversation.
 * @param initialMessage - (Optional) The initial message to start the conversation with.
 * @returns The new conversation ID.
 */
export async function startNewConversation(
	senderId: string,
	recipientId: string,
	initialMessage?: string
): Promise<string> {
	try {
		const existingConversationId = await areUsersInConversationTogether(senderId, recipientId);
		if (existingConversationId) {
			return existingConversationId;
		}
		// Create a reference to the new conversation
		const conversationRef = database().ref("conversations").push();

		// Prepare the conversation data
		const newConversation: IConversation = {
			conversationId: conversationRef.key!, // Auto-generated key from Firebase
			createdAt: Date.now(),
			isHidden: false,
			isMutingNotifications: false,
			isPinned: false,
			isReadOnly: false,
			unreadMessagesCount: 0,
			lastMessage: initialMessage || "",
			lastMessageTimestamp: Date.now(),
			lastSenderId: senderId,
			members: {
				[senderId]: true,
				[recipientId]: true,
			},
		};

		await conversationRef.set(newConversation);

		if (initialMessage) {
			const message: IMessage = {
				body: initialMessage,
				senderId,
				messageType: MessageType.TEXT,
			};
			sendMessage(newConversation.conversationId, message);
		}

		return conversationRef.key!;
	} catch (error) {
		console.error("Error starting new conversation:", error);
		throw error;
	}
}

/**
 * Update the messages readby property to mark a message as read by a user.
 * @param conversationId - The ID of the conversation.
 * @param messageId - The ID of the message to mark as read.
 * @param userId - The ID of the user who read the message.
 */
export async function markMessageAsRead(conversationId: string, messageId: string, userId: string) {
	const messagesRef = database().ref(`messages/${conversationId}`);
	try {
		await messagesRef
			.child(messageId)
			.child("readBy")
			.update({
				[userId]: true,
			});
	} catch (error) {
		throw error;
	}
}
