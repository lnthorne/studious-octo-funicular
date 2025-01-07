import {
	FlatList,
	RefreshControl,
	StyleSheet,
	View,
	Image,
	ListRenderItem,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import React from "react";
import { Timestamp } from "@react-native-firebase/firestore";
import { ATText } from "../atoms/Text";
import { IPostEntity } from "@/typings/jobs.inter";
import { Colors } from "@/app/design-system/designSystem";

interface ListingProps {
	data: IPostEntity[];
	isRefresh: boolean;
	onRefresh: () => void;
	onPress: (job: IPostEntity) => void;
}

export default function ORJobListing({ data, isRefresh, onRefresh, onPress }: ListingProps) {
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
		if (title.length > 30) {
			return title.substring(0, 27) + "...";
		}
		return title;
	};

	const renderItem: ListRenderItem<IPostEntity> = ({ item }) => {
		return (
			<TouchableOpacity style={styles.postContainer} onPress={() => onPress(item)}>
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
			</TouchableOpacity>
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
		paddingHorizontal: 10,
	},
	postContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		minHeight: 76,
		borderBottomColor: Colors.borderBottomColor,
		borderBottomWidth: 1,
		borderBottomStartRadius: 30,
		borderBottomEndRadius: 30,
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
