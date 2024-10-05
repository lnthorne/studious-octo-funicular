import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "react-native-ui-lib";
import { ATText } from "@/components/atoms/Text";
import ATChip from "@/components/atoms/Chips";
import { useUser } from "@/contexts/userContext";
import { IHomeOwnerEntity } from "@/typings/user.inter";
import { IPostEntity, JobStatus } from "@/typings/jobs.inter";
import { fetchJobsWithBidsByStatus } from "@/services/post";

export default function Home() {
	const { user } = useUser<IHomeOwnerEntity>();
	const [jobsWithBids, setJobsWithBids] = useState<IPostEntity[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>([JobStatus.open]);
	const [loading, setLoading] = useState(true);
	const [isRefresh, setIsRefresh] = useState(false);

	const fetchJobs = async (status: JobStatus[], isRefreshing: Boolean = false) => {
		if (!user) return;
		if (!isRefreshing) setLoading(true);
		if (status.length < 1) {
			setJobsWithBids([]);
			return;
		}

		try {
			const jobs = await fetchJobsWithBidsByStatus(user.uid, status);
			setJobsWithBids(jobs);
		} catch (error) {
			console.error("failed to fetch jobs and bids:", error);
		} finally {
			if (isRefreshing) {
				setIsRefresh(false);
			} else {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		fetchJobs(selectedStatuses);
	}, []);

	const handleToggleStatus = (status: JobStatus) => {
		setSelectedStatuses((prevStatuses) => {
			const newStatuses: JobStatus[] = prevStatuses.includes(status)
				? prevStatuses.filter((s) => s !== status) // Remove status if it was already selected
				: [...prevStatuses, status]; // Add status if it's not selected

			fetchJobs(newStatuses);

			return newStatuses;
		});
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.column}>
				<ATText typography="subheading" style={{ fontSize: 20 }}>
					Status
				</ATText>
				<View style={styles.row}>
					<ATChip
						label="Open"
						isToggled={selectedStatuses.includes(JobStatus.open)}
						onPress={() => handleToggleStatus(JobStatus.open)}
					/>
					<ATChip
						label="Pending"
						isToggled={selectedStatuses.includes(JobStatus.inprogress)}
						onPress={() => handleToggleStatus(JobStatus.inprogress)}
					/>
					<ATChip
						label="Closed"
						isToggled={selectedStatuses.includes(JobStatus.completed)}
						onPress={() => handleToggleStatus(JobStatus.completed)}
					/>
				</View>
				<FlatList
					data={jobsWithBids}
					keyExtractor={(item) => item.pid}
					renderItem={({ item }) => {
						return <ATText typography="body">{item.title}</ATText>;
					}}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		width: "100%",
	},
	column: {
		paddingTop: 50,
		paddingHorizontal: 18,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		gap: 12,
		alignSelf: "stretch",
	},
});
