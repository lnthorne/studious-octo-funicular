import { router, Tabs } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Link, usePathname } from "expo-router";
import { Colors } from "@/app/design-system/designSystem";
import { ATText } from "@/components/atoms/Text";

export default function CompanyownerHomeLayout() {
	const currentRoute = usePathname();

	return (
		<SafeAreaView style={styles.safeAreaContainer}>
			<View style={{ flex: 1 }}>
				<View style={styles.tabContainer}>
					<TouchableOpacity
						onPress={() => router.navigate("/companyowner/bids/pending")}
						style={styles.tab}
					>
						<ATText
							typography={currentRoute === "/companyowner/bids/pending" ? "body" : "secondaryText"}
							color={
								currentRoute === "/companyowner/bids/pending"
									? "primaryTextColor"
									: "secondaryTextColor"
							}
							style={{ textAlign: "center" }}
						>
							Pending Bids
						</ATText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.navigate("/companyowner/bids")}
						style={styles.tab}
					>
						<ATText
							typography={currentRoute === "/companyowner/bids" ? "body" : "secondaryText"}
							color={
								currentRoute === "/companyowner/bids" ? "primaryTextColor" : "secondaryTextColor"
							}
							style={{ textAlign: "center" }}
						>
							In Progress
						</ATText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.navigate("/companyowner/bids/closed")}
						style={styles.tab}
					>
						<ATText
							typography={currentRoute === "/companyowner/bids/closed" ? "body" : "secondaryText"}
							color={
								currentRoute === "/companyowner/bids/closed"
									? "primaryTextColor"
									: "secondaryTextColor"
							}
							style={{ textAlign: "center" }}
						>
							Closed
						</ATText>
					</TouchableOpacity>
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
	safeAreaContainer: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	tabContainer: {
		flexDirection: "row",
		justifyContent: "center",
		paddingVertical: 10,
		backgroundColor: "transparent",
		alignItems: "center",
		alignSelf: "stretch",
		gap: 32,
	},
	tab: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
