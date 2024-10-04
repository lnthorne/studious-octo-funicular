import { Tabs } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Link, usePathname } from "expo-router";

export default function HomeownerHomeLayout() {
	const currentRoute = usePathname();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>
				<View style={styles.tabContainer}>
					<Link
						href="/homeowner/home"
						style={currentRoute === "/homeowner/home" ? styles.activeTab : styles.tab}
					>
						<Text
							style={currentRoute === "/homeowner/home" ? styles.activeTabText : styles.tabText}
						>
							Open Jobs
						</Text>
					</Link>
					<Link
						href="/homeowner/home/inProgressJobs"
						style={
							currentRoute === "/homeowner/home/inProgressJobs" ? styles.activeTab : styles.tab
						}
					>
						<Text
							style={
								currentRoute === "/homeowner/home/inProgressJobs"
									? styles.activeTabText
									: styles.tabText
							}
						>
							In Progress
						</Text>
					</Link>
					<Link
						href="/homeowner/home/closedJobs"
						style={currentRoute === "/homeowner/home/closedJobs" ? styles.activeTab : styles.tab}
					>
						<Text
							style={
								currentRoute === "/homeowner/home/closedJobs"
									? styles.activeTabText
									: styles.tabText
							}
						>
							Closed Jobs
						</Text>
					</Link>
				</View>
				<Tabs
					screenOptions={{
						headerShown: false,
						tabBarStyle: { display: "none" },
					}}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tabContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 10,
		backgroundColor: "transparent",
	},
	tab: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: "#6200ee", // Indicator for the active tab
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	tabText: {
		fontSize: 16,
		color: "#999",
	},
	activeTabText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#6200ee",
	},
});