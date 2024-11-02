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
import { subscribeToConversations } from "@/services/messaging";
import { IConversation } from "@/typings/messaging.inter";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { Colors } from "react-native-ui-lib";
import { ATText } from "@/components/atoms/Text";

export default function ConversationsPage() {
	const [conversations, setConversations] = useState<IConversation[]>([]);
	const [loading, setLoading] = useState(false);
	const { user } = useUser<IHomeOwnerEntity>();

	useEffect(() => {
		setLoading(true);
		if (!user) return;
		const usersName = user.firstname + " " + user.lastname;
		const unsubscribe = subscribeToConversations(user.uid, usersName, (updatedConversations) => {
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

	function getOtherUserName(members: { [userId: string]: string }): string | undefined {
		return Object.entries(members).find(([userId]) => userId !== user?.uid)?.[1];
	}

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size={"large"} color={Colors.primaryButtonColor} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				style={{ marginTop: 40 }}
				data={conversations}
				keyExtractor={(item) => item.conversationId}
				ListEmptyComponent={
					<ATText
						typography="secondaryText"
						color="secondaryTextColor"
						style={{ alignSelf: "center" }}
					>
						You have no messages...
					</ATText>
				}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.conversationItem}
						onPress={() =>
							handlePress(item.conversationId, getOtherUserName(item.members) || "Error")
						}
					>
						<Image
							source={require("../../../../assets/images/onboarding.png")}
							style={styles.avatar}
						/>
						<View style={{ flex: 1 }}>
							{/* Name and Username */}
							<ATText>{getOtherUserName(item.members) || "Error"}</ATText>

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
		borderBottomColor: Colors.borderBottomColor,
		borderBottomWidth: 1,
		borderBottomStartRadius: 30,
		borderBottomEndRadius: 30,
		height: 70,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		marginRight: 12,
	},
	timestamp: {
		fontSize: 12,
		color: Colors.timestamp,
		textAlign: "right",
	},
});
