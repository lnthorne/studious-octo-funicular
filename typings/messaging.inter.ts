import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export enum MessageType {
	TEXT = "text",
	IMAGE = "image",
	FILE = "file",
}

export interface IConversation {
	conversationId: string;
	createdAt: number; // Unix timestamp
	isHidden: boolean;
	isMutingNotifications: boolean;
	isPinned: boolean;
	isReadOnly: boolean;
	unreadMessagesCount: number;
	lastMessage: string;
	lastMessageTimestamp: number; // Unix timestamp
	lastSenderId: string;
	members: { [userId: string]: true }; // An object where keys are userIds and values are always true
}

export interface IMessage {
	body: string;
	senderId: string;
	messageType: MessageType;
}

export interface IMessageEntity extends IMessage {
	messageId: string;
	timestamp: number;
	readBy?: { [userId: string]: true };
}

export interface IUserConversations {
	[conversationId: string]: true;
}
