import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	Image,
	Animated,
} from "react-native";
import { router } from "expo-router";
import { useUser } from "@/contexts/userContext";
import { ICompanyOwnerEntity, IHomeOwnerEntity, UserType } from "@/typings/user.inter";
import { ATText } from "@/components/atoms/Text";
import { useConversations } from "@/hooks/useConversations";
import { Colors } from "@/app/design-system/designSystem";
import { SkeletonView } from "react-native-ui-lib";

export default function ConversationsPage() {
	const opacity = useRef(new Animated.Value(0)).current;
	const { user } = useUser<IHomeOwnerEntity>();
	const {
		data: conversations,
		isLoading,
		error,
	} = useConversations<ICompanyOwnerEntity>(user, UserType.companyowner);

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

	const handlePress = (conversationId: string, otherName: string | undefined) => {
		router.push({
			pathname: "/shared/messages/[conversationId]",
			params: {
				conversationId,
				name: otherName || "Error",
			},
		});
	};

	useEffect(() => {
		if (!isLoading) {
			Animated.timing(opacity, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [isLoading]);

	return (
		<SafeAreaView style={styles.container}>
			{isLoading && (
				<SkeletonView showContent={false} template={SkeletonView.templates.LIST_ITEM} times={9} />
			)}
			<Animated.View style={[{ flex: 1 }, { opacity }]}>
				<FlatList
					style={{ paddingTop: 10 }}
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
						<View style={styles.itemWrapper}>
							<View style={styles.conversationItem}>
								<TouchableOpacity
									style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
									onPress={() => handlePress(item.conversationId, item.otherUser.companyName)}
								>
									<Image
										source={
											item.otherUser.profileImage
												? { uri: item.otherUser.profileImage }
												: require("../../../../assets/images/welcome.png")
										}
										style={[
											styles.avatar,
											item.unreadMessagesCount > 0 && item.lastSenderId !== user?.uid
												? styles.notification
												: null,
										]}
									/>
									<View style={{ flex: 1 }}>
										<ATText>{item.otherUser.companyName || "Error"}</ATText>

										<ATText typography="secondaryText" color="secondaryTextColor">
											{item.lastMessage}
										</ATText>
									</View>

									<Text style={styles.timestamp}>
										{formatMessageDate(item.lastMessageTimestamp)}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				/>
			</Animated.View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	itemWrapper: {
		overflow: "hidden", // Ensures each item fits within its container
	},
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
		height: 75,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 12,
	},
	timestamp: {
		fontSize: 12,
		color: Colors.timestamp,
		textAlign: "right",
	},
	notification: {
		borderWidth: 5,
		borderColor: Colors.primaryDotColor,
	},
});
