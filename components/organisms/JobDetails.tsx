import { StyleSheet, View } from "react-native";
import React from "react";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { ATText } from "../atoms/Text";
import MLCollage from "../molecules/Collage";
import { Timestamp } from "@react-native-firebase/firestore";
import { getGeoInformation } from "@/services/geocode";
import { useQuery } from "@tanstack/react-query";

interface JobDetailProps {
	jobDetails: IPostEntity | null;
}

const matrixLayout = [[], [1], [1, 1], [2, 1], [2, 2], [3, 2], [2, 3, 1]];

export default function ORJobDetails({ jobDetails }: JobDetailProps) {
	const { data } = useQuery({
		queryKey: ["geolocation", jobDetails?.zipcode],
		enabled: !!jobDetails?.zipcode,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		queryFn: () => getGeoInformation(jobDetails!.zipcode, "CA"),
	});

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

	const generateDateText = () => {
		const bidLastUpdated = jobDetails?.bids?.[0].lastUpdatedAt;
		console.log("JOB DETAIL", jobDetails);
		if (jobDetails.jobStatus === JobStatus.completed && bidLastUpdated) {
			return (
				<>
					<ATText>{formatDate(bidLastUpdated as Timestamp)}</ATText>
					<ATText typography="secondaryText" color="secondaryTextColor">
						Job complete
					</ATText>
				</>
			);
		}
		if (jobDetails.jobStatus === JobStatus.inprogress && bidLastUpdated) {
			return (
				<>
					<ATText>{formatDate(bidLastUpdated as Timestamp)}</ATText>
					<ATText typography="secondaryText" color="secondaryTextColor">
						Bid accepted
					</ATText>
				</>
			);
		}
		return (
			<>
				<ATText>{formatDate(jobDetails.estimatedStartDate)}</ATText>
				<ATText typography="secondaryText" color="secondaryTextColor">
					Estimated start date
				</ATText>
			</>
		);
	};

	const numberOfImages = jobDetails.imageUrls?.length || 0;
	return (
		<View>
			<ATText typography="heading" style={styles.heading}>
				{jobDetails.title}
			</ATText>
			<MLCollage images={jobDetails.imageUrls || []} matrix={matrixLayout[numberOfImages]} />
			<ATText typography="body">{jobDetails.description}</ATText>
			<View style={styles.textContainer}>
				{data?.error ? (
					<ATText>{jobDetails.zipcode.toUpperCase()}</ATText>
				) : (
					<ATText>{`${data?.city}, ${data?.province}`}</ATText>
				)}

				<ATText typography="secondaryText" color="secondaryTextColor">
					Location
				</ATText>
			</View>
			<View style={styles.textContainer}>{generateDateText()}</View>
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
