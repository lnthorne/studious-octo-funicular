import {
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	View,
	Image,
	ListRenderItem,
	ActivityIndicator,
	Animated,
} from "react-native";
import React, { useRef, useState } from "react";
import { Timestamp } from "@react-native-firebase/firestore";
import ATChip from "../atoms/Chips";
import { ATText } from "../atoms/Text";
import { IPostEntity } from "@/typings/jobs.inter";
import { Colors } from "react-native-ui-lib";

interface ListingProps {
	data: IPostEntity[];
	isRefresh: boolean;
	onRefresh: () => void;
	onPress: (job: IPostEntity) => void;
	chipLabel: string;
}

export default function ORHomeownerJobListing({
	data,
	isRefresh,
	onRefresh,
	onPress,
	chipLabel,
}: ListingProps) {
	const fadeAnim = useRef<Animated.Value[]>([]).current;

	const handleFadeIn = (index: number) => {
		Animated.timing(fadeAnim[index], {
			toValue: 1,
			duration: 500,
			delay: index * 100, // Stagger each item's fade-in by 100ms
			useNativeDriver: true,
		}).start();
	};

	const getpostImage = (uri: string | undefined) => {
		if (uri) return { uri };

		return require("../../assets/images/welcome.png");
	};

	const getDaysAgo = (createdAt: Timestamp) => {
		const createdDate = createdAt.toDate();
		const currentDate = new Date();

		const diffTime = currentDate.getTime() - createdDate.getTime();

		// Convert the time difference to days
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 1000 ms * 60 s * 60 m * 24 h

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "1 day ago";
		return `${diffDays} days ago`;
	};

	const shortenTitle = (title: string): string => {
		if (title.length > 19) {
			return title.substring(0, 16) + "...";
		}
		return title;
	};

	const renderItem: ListRenderItem<IPostEntity> = ({ item }) => {
		return (
			<View style={styles.postContainer}>
				<View style={styles.imageContainer}>
					<ActivityIndicator
						style={styles.loadingIndicator}
						size="small"
						color={Colors.primaryButtonColor}
					/>
					<Image source={getpostImage(item.imageUrls?.[0])} style={styles.image} />
				</View>
				<View style={styles.column}>
					<ATText typography="body">{shortenTitle(item.title)}</ATText>
					<ATText typography="secondary" color="secondaryTextColor">
						{getDaysAgo(item.createdAt as Timestamp)}
					</ATText>
				</View>
				<ATChip label={chipLabel} isToggled={false} onPress={() => onPress(item)} />
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				keyExtractor={(item) => item.pid}
				renderItem={renderItem}
				ListEmptyComponent={
					<ATText
						typography="secondaryText"
						color="secondaryTextColor"
						style={{ alignSelf: "center" }}
					>
						No jobs found...
					</ATText>
				}
				refreshControl={
					<RefreshControl
						refreshing={isRefresh}
						onRefresh={onRefresh}
						progressBackgroundColor={Colors.primaryButtonColor}
						tintColor={Colors.primaryButtonColor}
					/>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	postContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		minHeight: 76,
	},
	column: {
		flex: 1,
		marginRight: 4,
		paddingHorizontal: 10,
	},
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		height: 56,
		width: 56,
	},
	loadingIndicator: {
		position: "absolute",
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
	},
});
