import { ATText } from "@/components/atoms/Text";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { Text, View } from "react-native";
import { Colors } from "react-native-ui-lib";
const HomeHeader = () => (
	<ATText typography="heading" style={{ fontSize: 28 }}>
		Dashboard
	</ATText>
);
const CreateJobHeader = () => (
	<ATText typography="heading" style={{ fontSize: 28 }}>
		New Job
	</ATText>
);
export default function MainLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				tabBarStyle: {
					backgroundColor: Colors.tabBarColor,
					borderTopWidth: 2,
					borderTopColor: Colors.tabBorderTopColor,
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					headerTransparent: true,
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
				name="createPost"
				options={{
					headerTransparent: true,
					headerTitleAlign: "left",
					headerTitle: () => <CreateJobHeader />,
					tabBarShowLabel: false,
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "add-circle" : "add-circle-outline"}
							size={25}
							color={Colors.tabIconColor}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="conversations"
				options={{
					tabBarShowLabel: false,
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
					tabBarShowLabel: false,
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
