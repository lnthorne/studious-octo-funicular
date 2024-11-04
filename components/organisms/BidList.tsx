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
		<View style={styles.container}>
			{renderHeading()}
			<View style={styles.gridContainer}>
				{bids.map((item, index) => (
					<View key={item.bid} style={styles.itemWrapper}>
						<TouchableOpacity onPress={() => onPress(item)} style={styles.itemContainer}>
							<Image source={require("../../assets/images/onboarding.png")} style={styles.image} />
							<ATText typography="body">{`$${item.bidAmount}`}</ATText>
							<ATText typography="secondaryText" color="secondaryTextColor">
								By {item.companyName}
							</ATText>
						</TouchableOpacity>
						{/* Add spacing on the right for even items in the first column */}
						{index % 2 === 0 && <View style={styles.spacer} />}
					</View>
				))}
			</View>
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
	container: {
		flex: 1,
	},

	gridContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	itemWrapper: {
		flexDirection: "row",
		flexBasis: "48%", // Occupy 48% width to create two columns with space between
		marginBottom: 10,
	},
	spacer: {
		flexBasis: "4%", // Adds space between two items in a row
	},
});
