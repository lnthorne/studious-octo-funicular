import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { IBidEntity } from "@/typings/jobs.inter";
import { ATText } from "./atoms/Text";
import { useUser } from "@/contexts/userContext";
import { ICompanyOwnerEntity } from "@/typings/user.inter";

interface MyBidProps {
	bid: IBidEntity | undefined;
}

export default function MyBid({ bid }: MyBidProps) {
	const { user } = useUser<ICompanyOwnerEntity>();
	if (!bid) {
		return (
			<View style={styles.container}>
				<ATText typography="error" color="error">
					There was an error fetching your bid...
				</ATText>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<ATText typography="heading">Your Bid</ATText>
			<View style={styles.detailsContainer}>
				<Image
					source={
						user?.profileImage
							? { uri: user.profileImage }
							: require("../assets/images/welcome.png")
					}
					style={styles.image}
				/>
				<View style={{ flex: 1 }}>
					<ATText>{`$${bid?.bidAmount}`}</ATText>
					<ATText typography="secondaryText" color="secondaryTextColor">
						{bid?.description}
					</ATText>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 16,
	},
	detailsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
		paddingVertical: 12,
	},
	image: {
		width: 48,
		height: 48,
		borderRadius: 8,
	},
});
