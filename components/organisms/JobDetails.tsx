import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { IPostEntity } from "@/typings/jobs.inter";
import { ATText } from "../atoms/Text";
import MLCollage from "../molecules/Collage";
import { Timestamp } from "@react-native-firebase/firestore";
import { getCityFromPostalCode } from "@/services/geocode";
import { GeocodeInformation } from "@/typings/geocode.inter";

interface JobDetailProps {
	jobDetails: IPostEntity | null;
}

const matrixLayout = [[], [1], [1, 1], [2, 1], [2, 2], [3, 2], [2, 3, 1]];

export default function ORJobDetails({ jobDetails }: JobDetailProps) {
	const [geocode, setGeocode] = useState<GeocodeInformation>();

	if (!jobDetails) {
		return (
			<ATText typography="subheading" color="error">
				No Job Data
			</ATText>
		);
	}

	const formatDate = (createdAt: Timestamp | Date): string => {
		let formattedDate;
		if (createdAt instanceof Timestamp) {
			formattedDate = createdAt.toDate();
		} else {
			formattedDate = createdAt;
		}
		return formattedDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getGeocodeInformation = async () => {
		const geocodeData = await getCityFromPostalCode(jobDetails.zipcode, "CA");
		setGeocode(geocodeData);
	};

	useEffect(() => {
		getGeocodeInformation();
	}, []);

	const numberOfImages = jobDetails.imageUrls?.length || 0;
	return (
		<View>
			<ATText typography="heading" style={styles.heading}>
				{jobDetails.title}
			</ATText>
			<MLCollage images={jobDetails.imageUrls || []} matrix={matrixLayout[numberOfImages]} />
			<ATText typography="body">{jobDetails.description}</ATText>
			<View style={styles.textContainer}>
				<ATText>{`$${jobDetails.budget}`}</ATText>
				<ATText typography="secondaryText" color="secondaryTextColor">
					Budget
				</ATText>
			</View>
			<View style={styles.textContainer}>
				<ATText>{`${geocode?.city}, ${geocode?.province}`}</ATText>
				<ATText typography="secondaryText" color="secondaryTextColor">
					Location
				</ATText>
			</View>
			<View style={styles.textContainer}>
				<ATText>{formatDate(jobDetails.estimatedStartDate)}</ATText>
				<ATText typography="secondaryText" color="secondaryTextColor">
					Start date
				</ATText>
			</View>
			<View style={styles.textContainer}>
				<ATText>{formatDate(jobDetails.createdAt as Timestamp)}</ATText>
				<ATText typography="secondaryText" color="secondaryTextColor">
					Posted on
				</ATText>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	heading: {
		paddingVertical: 12,
	},
	textContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		minHeight: 72,
		paddingVertical: 8,
		alignSelf: "stretch",
	},
});
