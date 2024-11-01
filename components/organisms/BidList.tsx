import { FlatList, StyleSheet, View, Image, ListRenderItem, TouchableOpacity } from "react-native";
import React from "react";
import { ATText } from "../atoms/Text";
import { IBidEntity, JobStatus } from "@/typings/jobs.inter";
import { useJobContext } from "@/contexts/jobContext";

interface BidListProps {
	bids: IBidEntity[] | undefined;
	onPress: (selectedBid: IBidEntity) => void;
}

export default function ORBidList({ bids, onPress }: BidListProps) {
	const { selectedJob } = useJobContext();
	if (!bids || bids.length < 1) {
		return <></>;
	}

	const renderItem: ListRenderItem<IBidEntity> = ({ item }) => (
		<View style={styles.itemContainer}>
			<TouchableOpacity onPress={() => onPress(item)} style={{ alignItems: "center" }}>
				<Image source={require("../../assets/images/onboarding.png")} style={styles.image} />
				<ATText typography="body">{`$${item.bidAmount}`}</ATText>
				<ATText typography="secondaryText" color="secondaryTextColor">
					By {item.companyName}
				</ATText>
			</TouchableOpacity>
		</View>
	);

	const renderHeading = () => {
		if (selectedJob?.jobStatus === JobStatus.inprogress) {
			return (
				<ATText typography="heading" style={styles.heading}>
					Winning Bid
				</ATText>
			);
		}
		return (
			<>
				<ATText typography="heading" style={styles.heading}>
					Bids Recieved
				</ATText>
				<ATText typography="body">{`You've received ${
					bids.length > 1 ? `${bids.length} bids` : `1 bid`
				}
			`}</ATText>
			</>
		);
	};
	return (
		<FlatList
			data={bids}
			keyExtractor={(item) => item.bid}
			numColumns={2}
			ListHeaderComponent={renderHeading}
			renderItem={renderItem}
		/>
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
