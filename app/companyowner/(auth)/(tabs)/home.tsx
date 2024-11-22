// app/home/createPost.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import { fetchOpenJobPostsNotBidOn } from "@/services/post";
import { IPostEntity } from "@/typings/jobs.inter";
import { router, useFocusEffect } from "expo-router";
import { useUser } from "@/contexts/userContext";
import { ICompanyOwnerEntity } from "@/typings/user.inter";
import MLSlider from "@/components/molecules/Slider";
import { MLTextBox } from "@/components/molecules/TextBox";
import { Colors } from "@/app/design-system/designSystem";

export default function ViewPostsScreen() {
	const { user } = useUser<ICompanyOwnerEntity>();
	const [posts, setPosts] = useState<IPostEntity[]>([]);
	const [loading, setLoading] = useState(true);
	const [isRefresh, setIsRefresh] = useState(false);
	const [radius, setRadius] = useState(10);
	const [zipcodeSearch, setZipcodeSearch] = useState<string>();

	const loadPosts = async (isRefreshing: boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		try {
			const openPosts = await fetchOpenJobPostsNotBidOn(user.uid);
			setPosts(openPosts);
		} catch (error) {
			console.error("Error fetching posts", error);
		} finally {
			if (isRefreshing) {
				setIsRefresh(false);
			} else {
				setLoading(false);
			}
		}
	};

	useFocusEffect(
		useCallback(() => {
			loadPosts();
		}, [user])
	);

	const onRefresh = () => {
		setIsRefresh(true);
		loadPosts(true);
	};

	const handlePostPress = (pid: string) => {
		router.push(`/companyowner/createBid/${pid}`);
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size={"large"} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<MLTextBox
				placeholder="Enter postal code"
				value={zipcodeSearch}
				onChangeText={setZipcodeSearch}
			/>
			<MLSlider radius={radius} onRadiusChange={setRadius} />
			{/* <FlatList
				data={posts}
				keyExtractor={(item) => item.pid}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handlePostPress(item.pid)}>
						<View style={styles.postContainer}>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={styles.description}>{item.description}</Text>
							<Text style={styles.status}>Status: {item.jobStatus}</Text>
						</View>
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={styles.title}>No open job posts available.</Text>}
				refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
			/> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: Colors.backgroundColor,
	},
	postContainer: {
		backgroundColor: Colors.backgroundColor,
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	description: {
		fontSize: 14,
		marginVertical: 8,
	},
	status: {
		fontSize: 12,
		color: "gray",
	},
});
