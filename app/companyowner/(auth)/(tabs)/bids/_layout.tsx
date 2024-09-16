import { Tabs } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Link, usePathname } from "expo-router";

export default function CompanyownerHomeLayout() {
	const currentRoute = usePathname();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>
				<View style={styles.tabContainer}>
					<Link
						href="/companyowner/bids"
						style={currentRoute === "/companyowner/bids" ? styles.activeTab : styles.tab}
					>
						<Text
							style={currentRoute === "/companyowner/bids" ? styles.activeTabText : styles.tabText}
						>
							In Progress
						</Text>
					</Link>
					<Link
						href="/companyowner/bids/pending"
						style={currentRoute === "/companyowner/bids/pending" ? styles.activeTab : styles.tab}
					>
						<Text
							style={
								currentRoute === "/companyowner/bids/pending"
									? styles.activeTabText
									: styles.tabText
							}
						>
							Pending
						</Text>
					</Link>
					<Link
						href="/companyowner/bids/closed"
						style={currentRoute === "/companyowner/bids/closed" ? styles.activeTab : styles.tab}
					>
						<Text
							style={
								currentRoute === "/companyowner/bids/closed" ? styles.activeTabText : styles.tabText
							}
						>
							Closed
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
