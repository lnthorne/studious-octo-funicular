import { View, Text, StyleSheet, ActivityIndicator, Image, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { IBid, IPostEntity } from "@/typings/jobs.inter";
import { fetchPost } from "@/services/post";
import { BidModal } from "@/components/BidModal";
import { ICompanyOwnerEntity, UserType } from "@/typings/user.inter";
import { getUser } from "@/services/user";
import { submitBid } from "@/services/bid";

export default function CreateBidScreen() {
	const { posting } = useLocalSearchParams<{ posting: string }>();
	const [post, setPosting] = useState<IPostEntity | null>(null);
	const [user, setUser] = useState<ICompanyOwnerEntity | null>(null);
	const [loading, setLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (!posting) return;
			setLoading(true);
			try {
				const postData = await fetchPost(posting);
				setPosting(postData);

				const userData = await getUser<ICompanyOwnerEntity>(UserType.companyowner);
				setUser(userData);
			} catch (error) {
				console.error("Error fetching post", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
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
		<View style={styles.container}>
			<Text style={styles.title}>{post?.title}</Text>
			<Text style={styles.description}>{post?.description}</Text>
			<Text style={styles.status}>Status: {post?.jobStatus}</Text>
			{post?.imageUrl && <Image source={{ uri: post?.imageUrl }} style={styles.image} />}

			<Button title="BID" onPress={() => setModalVisible(true)} />

			<BidModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSubmit={handleBidSubmit}
			/>
		</View>
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
	image: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		marginBottom: 20,
	},
});
