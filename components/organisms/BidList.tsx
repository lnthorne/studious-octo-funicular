import { FlatList, StyleSheet, Text, View, Image, ListRenderItem } from "react-native";
import React from "react";
import { ATText } from "../atoms/Text";
import { IBidEntity } from "@/typings/jobs.inter";

interface BidListProps {
	bids: IBidEntity[] | undefined;
}

export default function ORBidList({ bids }: BidListProps) {
	if (!bids || bids.length < 1) {
		return <></>;
	}

	const renderItem: ListRenderItem<IBidEntity> = ({ item }) => (
		<View style={styles.itemContainer}>
			<Image source={require("../../assets/images/onboarding.png")} style={styles.image} />
			<ATText typography="body">{`$${item.bidAmount}`}</ATText>
			<ATText typography="secondaryText" color="secondaryTextColor">
				By {item.companyName}
			</ATText>
		</View>
	);
	return (
		<View>
			<ATText typography="heading" style={styles.heading}>
				Bids Received
			</ATText>
			<ATText typography="body">{`You've received ${
				bids.length > 1 ? `${bids.length} bids` : `1 bid`
			}
			`}</ATText>
			<FlatList
				data={bids}
				keyExtractor={(item) => item.bid}
				numColumns={2}
				renderItem={renderItem}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	noInfo: {
		paddingBottom: 10,
		alignSelf: "center",
	},
	heading: {
		paddingVertical: 8,
	},
	itemContainer: {
		flex: 1,
		alignItems: "center",
		marginBottom: 20,
	},
	image: {
		width: 140,
		height: 140,
		borderRadius: 70,
		marginBottom: 10,
	},
});
