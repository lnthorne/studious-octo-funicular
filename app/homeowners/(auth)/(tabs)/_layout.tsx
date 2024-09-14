import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function MainLayout() {
	return (
		<Tabs screenOptions={{ headerShown: true }}>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						// You can use an icon here, for now, let's use a simple text.
						<Text style={{ color }}>🏠</Text>
					),
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="createPost"
				options={{
					title: "Create Post",
					tabBarIcon: ({ color, size }) => <Text style={{ color }}>✏️</Text>,
				}}
			/>
			<Tabs.Screen
				name="conversations"
				options={{
					title: "Messages",
					tabBarIcon: ({ color, size }) => <Text style={{ color }}>✉️</Text>,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, size }) => <Text style={{ color }}>⚙️</Text>,
				}}
			/>
		</Tabs>
	);
}
