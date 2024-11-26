import { Colors } from "@/app/design-system/designSystem";
import { ATText } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

const HomeHeader = () => (
	<ATText typography="heading" style={{ fontSize: 28 }}>
		New Jobs
	</ATText>
);

const BidHeader = () => (
	<ATText typography="heading" style={{ fontSize: 28 }}>
		Jobs
	</ATText>
);

const ConversationHeader = () => (
	<ATText typography="heading" style={{ fontSize: 28 }}>
		Messages
	</ATText>
);

const ProfileHeader = () => (
	<ATText typography="heading" style={{ fontSize: 28 }}>
		Profile
	</ATText>
);

export default function HomeLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: Colors.tabBarColor,
					borderTopWidth: 1,
					borderTopColor: Colors.tabBorderTopColor,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					headerTransparent: false,
					headerStyle: {
						backgroundColor: Colors.backgroundColor,
						shadowOpacity: 0,
					},
					headerTitleAlign: "left",
					headerTitle: () => <HomeHeader />,
					tabBarShowLabel: false,
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={25}
							color={Colors.tabIconColor}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="bids"
				options={{
					headerTransparent: false,
					headerStyle: {
						backgroundColor: Colors.backgroundColor,
						shadowOpacity: 0,
					},
					headerTitleAlign: "left",
					headerTitle: () => <BidHeader />,
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "reader" : "reader-outline"}
							size={25}
							color={Colors.tabIconColor}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="conversations"
				options={{
					headerTransparent: false,
					headerStyle: {
						backgroundColor: Colors.backgroundColor,
						shadowOpacity: 0,
					},
					headerTitleAlign: "left",
					headerTitle: () => <ConversationHeader />,
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "chatbox" : "chatbox-outline"}
							size={25}
							color={Colors.tabIconColor}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					headerTransparent: false,
					headerStyle: {
						backgroundColor: Colors.backgroundColor,
						shadowOpacity: 0,
					},
					headerTitleAlign: "left",
					headerTitle: () => <ProfileHeader />,
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							size={25}
							color={Colors.tabIconColor}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
