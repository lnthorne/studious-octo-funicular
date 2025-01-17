import { router, Tabs } from "expo-router";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { usePathname } from "expo-router";
import { ATText } from "@/components/atoms/Text";
import { Colors } from "@/app/design-system/designSystem";

export default function HomeownerHomeLayout() {
	const currentRoute = usePathname();

	return (
		<SafeAreaView style={styles.safeAreaContainer}>
			<View style={{ flex: 1 }}>
				<View style={styles.tabContainer}>
					<TouchableOpacity onPress={() => router.navigate("/homeowner/home")} style={styles.tab}>
						<ATText
							typography={currentRoute === "/homeowner/home" ? "body" : "secondaryText"}
							color={currentRoute === "/homeowner/home" ? "primaryTextColor" : "secondaryTextColor"}
							style={{ textAlign: "center" }}
						>
							Open
						</ATText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.navigate("/homeowner/home/inProgressJobs")}
						style={styles.tab}
					>
						<ATText
							typography={
								currentRoute === "/homeowner/home/inProgressJobs" ? "body" : "secondaryText"
							}
							color={
								currentRoute === "/homeowner/home/inProgressJobs"
									? "primaryTextColor"
									: "secondaryTextColor"
							}
							style={{ textAlign: "center" }}
						>
							In Progress
						</ATText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => router.navigate("/homeowner/home/closedJobs")}
						style={styles.tab}
					>
						<ATText
							typography={currentRoute === "/homeowner/home/closedJobs" ? "body" : "secondaryText"}
							color={
								currentRoute === "/homeowner/home/closedJobs"
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
