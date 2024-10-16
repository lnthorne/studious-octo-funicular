import {
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	View,
	Image,
	ListRenderItem,
} from "react-native";
import React from "react";
import { Timestamp } from "@react-native-firebase/firestore";
import ATChip from "../atoms/Chips";
import { ATText } from "../atoms/Text";
import { IPostEntity } from "@/typings/jobs.inter";

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
				<Image source={getpostImage(item.imageUrls?.[0])} style={styles.image} />
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
				ListEmptyComponent={<Text>You have no open jobs.</Text>}
				refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
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
	image: {
		height: 56,
		width: 56,
		borderRadius: 8,
	},
});
