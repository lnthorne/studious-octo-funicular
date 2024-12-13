// app/home/createPost.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, SafeAreaView, Animated } from "react-native";
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
import ORJobListing from "@/components/organisms/HomeownerJobListing";
import { useJobContext } from "@/contexts/jobContext";
import { SkeletonView } from "react-native-ui-lib";

export default function ViewPostsScreen() {
	const opacity = useRef(new Animated.Value(0)).current;
	const { user } = useUser<ICompanyOwnerEntity>();
	const { setSelectedJob } = useJobContext();
	const [isZipValid, seZipValid] = useState(true);
	const [radius, setRadius] = useState(10);
	const [zipcodeSearch, setZipcodeSearch] = useState<string>("");
	const [isRefresh, setIsRefresh] = useState(false);
	const { data, isLoading, refetch, isError } = useQuery({
		queryKey: ["posts", user?.uid],
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		enabled: !!user && isZipValid,
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

	const handlePostPress = (selectedJob: IPostEntity) => {
		setSelectedJob(selectedJob);
		router.navigate(`/companyowner/jobDetailsPage`);
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
				onChangeText={(text) => {
					const formattedText = text.replace(/\s+/g, "");
					setZipcodeSearch(formattedText);
				}}
				errorText={isZipValid ? undefined : "Invalid postal code"}
				returnKeyType="done"
				autoCapitalize="characters"
				maxLength={6}
				onEndEditing={() => refetch()}
			/>
			<MLSlider radius={radius} onRadiusChange={setRadius} onSeekEnd={() => refetch()} />
			{isLoading && (
				<SkeletonView showContent={false} template={SkeletonView.templates.LIST_ITEM} times={8} />
			)}
			<Animated.View style={[{ flex: 1 }, { opacity }]}>
				<ORJobListing
					data={data || []}
					isRefresh={isRefresh}
					onRefresh={onRefresh}
					onPress={handlePostPress}
					chipLabel="View"
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
