import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Image,
	Button,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { IBid, IPostEntity } from "@/typings/jobs.inter";
import { fetchPost } from "@/services/post";
import { BidModal } from "@/components/BidModal";
import { ICompanyOwnerEntity } from "@/typings/user.inter";
import { submitBid } from "@/services/bid";
import { useUser } from "@/contexts/userContext";

export default function CreateBidScreen() {
	const { user } = useUser<ICompanyOwnerEntity>();
	const { posting } = useLocalSearchParams<{ posting: string }>();
	const [post, setPosting] = useState<IPostEntity | null>(null);
	const [loading, setLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);

	const fetchPostData = async () => {
		if (!posting) return;
		setLoading(true);
		try {
			const postData = await fetchPost(posting);
			setPosting(postData);
		} catch (error) {
			console.error("Error fetching post", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPostData();
	}, [posting]);

	const handleBidSubmit = async (bidAmount: string, bidDescription: string) => {
		if (!user) {
			console.error("User not found");
			return;
		}

		try {
			const bid: IBid = {
				bidAmount: Number(bidAmount),
				companyName: user.companyName,
				description: bidDescription,
				pid: posting,
				uid: user.uid,
			};
			await submitBid(bid);
		} catch (error) {
			console.error("Error submitting bid", error);
		} finally {
			setModalVisible(false);
			router.navigate("/companyowners/(tabs)/viewPosts");
		}
		console.log("Bid Submitted", { bidAmount, bidDescription });
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size={"large"} />
			</View>
		);
	}

	return (
		<SafeAreaView>
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.title}>{post?.title}</Text>
					<Text style={styles.description}>{post?.description}</Text>
					<Text style={styles.status}>Status: {post?.jobStatus}</Text>
					{post?.imageUrls && (
						<View style={styles.imageContainer}>
							{post?.imageUrls.map((uri, index) => (
								<Image key={index} source={{ uri }} style={styles.image} />
							))}
						</View>
					)}

					<Button title="BID" onPress={() => setModalVisible(true)} />

					<BidModal
						visible={modalVisible}
						onClose={() => setModalVisible(false)}
						onSubmit={handleBidSubmit}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
		backgroundColor: "#F5F5F5",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	description: {
		fontSize: 16,
		marginBottom: 10,
	},
	status: {
		fontSize: 14,
		color: "#777",
		marginBottom: 10,
	},
	imageContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 10,
	},
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		marginBottom: 20,
	},
});
