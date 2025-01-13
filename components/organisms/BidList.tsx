import { FlatList, StyleSheet, View, Image, ListRenderItem, TouchableOpacity } from "react-native";
import React from "react";
import { ATText } from "../atoms/Text";
import { IBidEntity, JobStatus } from "@/typings/jobs.inter";
import { useJobContext } from "@/contexts/jobContext";
import { useQuery } from "@tanstack/react-query";

interface BidListProps {
	onPress: (selectedBid: IBidEntity) => void;
}

export default function ORBidList({ onPress }: BidListProps) {
	const { selectedJob } = useJobContext();
	if (!selectedJob || !selectedJob.bids || selectedJob.bids.length < 1) {
		return (
			<ATText typography="secondaryText" color="secondaryTextColor" style={styles.listEmpty}>
				You have not received any bids...
			</ATText>
		);
	}

	const renderHeading = () => {
		if (selectedJob?.jobStatus !== JobStatus.open) {
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
					selectedJob!.bids!.length > 1 ? `${selectedJob!.bids!.length} bids` : `1 bid`
				}
			`}</ATText>
			</>
		);
	};
	return (
		<View style={styles.container}>
			{renderHeading()}
			<View style={styles.gridContainer}>
				{selectedJob?.bids?.map((item, index) => (
					<View key={item.bid} style={styles.itemWrapper}>
						<TouchableOpacity onPress={() => onPress(item)} style={styles.itemContainer}>
							<Image
								source={
									item.companyProfilePicture
										? { uri: item.companyProfilePicture }
										: require("../../assets/images/welcome.png")
								}
								style={styles.image}
							/>
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

	listEmpty: {
		paddingBottom: 10,
		alignSelf: "center",
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
