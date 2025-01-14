import { Colors } from "@/app/design-system/designSystem";
import { ATText } from "@/components/atoms/Text";
import Help from "@/components/Help";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const videoSource = require("../../../../assets/splash/homeowner-onboarding.mp4");

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
export default function MainLayout() {
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
					tabBarIcon: ({ focused }) => (
						<Ionicons
							name={focused ? "home" : "home-outline"}
							size={25}
							color={Colors.tabIconColor}
						/>
					),
				}}
			/>
			{/* TODO: Dont make background trans */}
			<Tabs.Screen
				name="createPost"
				options={{
					headerTransparent: false,
					headerStyle: {
						backgroundColor: Colors.backgroundColor,
						shadowOpacity: 0,
					},
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
					headerRight: () => <Help source={videoSource} />,
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
