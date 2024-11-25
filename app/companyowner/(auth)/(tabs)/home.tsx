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
	SafeAreaView,
} from "react-native";
import { fetchOpenJobPostsNotBidOn } from "@/services/post";
import { IPostEntity } from "@/typings/jobs.inter";
import { router } from "expo-router";
import { useUser } from "@/contexts/userContext";
import { ICompanyOwnerEntity } from "@/typings/user.inter";
import MLSlider from "@/components/molecules/Slider";
import { MLTextBox } from "@/components/molecules/TextBox";
import { Colors } from "@/app/design-system/designSystem";
import { getGeoInformation } from "@/services/geocode";
import { useQuery } from "@tanstack/react-query";
import { ATText } from "@/components/atoms/Text";

export default function ViewPostsScreen() {
	const { user } = useUser<ICompanyOwnerEntity>();
	const [isZipValid, seZipValid] = useState(false);
	const [radius, setRadius] = useState(10);
	const [zipcodeSearch, setZipcodeSearch] = useState<string>("");
	const [isRefresh, setIsRefresh] = useState(false);
	const { data, isLoading, refetch, isError } = useQuery({
		queryKey: ["posts", user?.uid, radius, zipcodeSearch],
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		enabled: !!user,
		queryFn: () => fetchPosts(user!.uid, radius, zipcodeSearch),
	});

	const fetchPosts = async (
		uid: string,
		radius: number,
		zipcodeSearch: string
	): Promise<IPostEntity[]> => {
		if (zipcodeSearch.trim() === "") {
			seZipValid(true);
			return await fetchOpenJobPostsNotBidOn(uid, radius);
		} else if (zipcodeSearch.trim().length === 6) {
			const { lat, lng } = await getGeoInformation(zipcodeSearch.trim(), "CA");
			seZipValid(true);
			return await fetchOpenJobPostsNotBidOn(uid, radius, [lat, lng]);
		} else {
			seZipValid(false);
			throw new Error("Postal code must be exactly 6 characters.");
		}
	};

	const onRefresh = async () => {
		setIsRefresh(true);
		await refetch();
		setIsRefresh(false);
	};

	const handlePostPress = (pid: string) => {
		router.push(`/companyowner/createBid/${pid}`);
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size={"large"} color={Colors.primaryButtonColor} />
			</SafeAreaView>
		);
	}

	if (isError) {
		return (
			<SafeAreaView style={[styles.container]}>
				<ATText typography="error" color="error" style={styles.center}>
					An error occurred. Please try again.
				</ATText>
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.container}>
			<MLTextBox
				placeholder="Enter postal code"
				value={zipcodeSearch}
				onChangeText={setZipcodeSearch}
				errorText={isZipValid ? undefined : "Invalid postal code"}
				returnKeyType="done"
				onEndEditing={() => refetch()}
			/>
			<MLSlider radius={radius} onRadiusChange={setRadius} onSeekEnd={() => refetch()} />
			<FlatList
				data={data}
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
			/>
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
	center: {
		alignSelf: "center",
	},
});
