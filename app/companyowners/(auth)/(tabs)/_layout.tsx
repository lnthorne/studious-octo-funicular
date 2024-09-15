import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function HomeLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => <Text style={{ color }}>🏠</Text>,
				}}
			/>
			<Tabs.Screen
				name="bids"
				options={{
					title: "Bids",
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						// You can use an icon here, for now, let's use a simple text.
						<Text style={{ color }}>💰</Text>
					),
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
