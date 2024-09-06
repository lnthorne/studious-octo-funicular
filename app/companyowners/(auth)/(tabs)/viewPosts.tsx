// app/home/createPost.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { fetchOpenJobPostsNotBidOn } from "@/services/post";
import { IPostEntity } from "@/typings/jobs.inter";
import { router, useFocusEffect } from "expo-router";
import { getUserId } from "@/services/user";

export default function ViewPostsScreen() {
	const [posts, setPosts] = useState<IPostEntity[]>([]);
	const [userId, setUserId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const uid = await getUserId();
				if (!uid) {
					console.error("No user id found");
					return;
				}
				setUserId(uid);
			} catch (error) {
				console.error("Error fetching user data", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	useFocusEffect(
		useCallback(() => {
			if (!userId) return;

			const loadPosts = async () => {
				setLoading(true);
				try {
					const openPosts = await fetchOpenJobPostsNotBidOn(userId);
					setPosts(openPosts);
				} catch (error) {
					console.error("Error fetching posts", error);
				} finally {
					setLoading(false);
				}
			};
			loadPosts();
		}, [userId])
	);

	const handlePostPress = (pid: string) => {
		router.push(`/companyowners/createBid/${pid}`);
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
			<FlatList
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
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	postContainer: {
		backgroundColor: "#f9f9f9",
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
