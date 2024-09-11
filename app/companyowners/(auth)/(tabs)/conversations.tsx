import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { subscribeToConversations } from "@/services/messaging"; // Your service
import { IConversation } from "@/typings/messaging.inter";
import { useUser } from "@/contexts/userContext"; // Assuming you have user context
import { ICompanyOwnerEntity } from "@/typings/user.inter";

export default function ConversationsPage() {
	const [conversations, setConversations] = useState<IConversation[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser<ICompanyOwnerEntity>();

	useEffect(() => {
		setLoading(true);
		if (!user) return;
		const unsubscribe = subscribeToConversations(user.uid, (updatedConversations) => {
			setConversations(updatedConversations);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [user]);

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={conversations}
				keyExtractor={(item) => item.conversationId}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.conversationItem}
						onPress={() => router.push(`/shared/messages/${item.conversationId}`)}
					>
						<Text style={styles.conversationTitle}>{Object.keys(item.members).join(", ")}</Text>
						<Text style={styles.lastMessage}>{item.lastMessage}</Text>
						<Text style={styles.timestamp}>
							{new Date(item.lastMessageTimestamp).toLocaleTimeString()}
						</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	conversationItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	conversationTitle: {
		fontWeight: "bold",
	},
	lastMessage: {
		color: "#666",
	},
	timestamp: {
		fontSize: 12,
		color: "#999",
		textAlign: "right",
	},
});
