import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
	Image,
} from "react-native";
import { router } from "expo-router";
import { subscribeToConversations } from "@/services/messaging"; // Your service
import { IConversation } from "@/typings/messaging.inter";
import { useUser } from "@/contexts/userContext"; // Assuming you have user context
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { Colors } from "react-native-ui-lib";
import { ATText } from "@/components/atoms/Text";

export default function ConversationsPage() {
	const [conversations, setConversations] = useState<IConversation[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser<IHomeOwnerEntity>();

	useEffect(() => {
		setLoading(true);
		if (!user) return;
		const unsubscribe = subscribeToConversations(user.uid, (updatedConversations) => {
			setConversations(updatedConversations);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [user]);

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

	const handlePress = (conversationId: string, name: string) => {
		// Navigate to the conversation details screen and pass conversationId and userName
		router.push({
			pathname: "/shared/messages/[conversationId]",
			params: {
				conversationId,
				name,
			},
		});
	};

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				style={{ marginTop: 40 }}
				data={conversations}
				keyExtractor={(item) => item.conversationId}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.conversationItem}
						onPress={() => handlePress(item.conversationId, "John Doe")}
					>
						<Image
							source={require("../../../../assets/images/onboarding.png")}
							style={styles.avatar}
						/>
						<View style={{ flex: 1 }}>
							{/* Name and Username */}
							<ATText>Thorne Landscaping Services</ATText>

							{/* Message */}
							<ATText typography="secondaryText" color="secondaryTextColor">
								{item.lastMessage}
							</ATText>
						</View>

						{/* Date */}
						<Text style={styles.timestamp}>{formatMessageDate(item.lastMessageTimestamp)}</Text>
					</TouchableOpacity>
				)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	conversationItem: {
		flexDirection: "row", // Align avatar and content horizontally
		alignItems: "center", // Vertically align the avatar with text
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	avatar: {
		width: 48, // Avatar size
		height: 48,
		borderRadius: 24, // Makes the avatar circular
		marginRight: 12, // Space between avatar and text
	},
	timestamp: {
		fontSize: 12,
		color: "#999",
		textAlign: "right",
	},
});
