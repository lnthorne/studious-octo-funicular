import { View, Text, Button, ActivityIndicator } from "react-native";
import { signOut } from "@/services/auth";

export default function SettingsScreen() {
	return (
		<View>
			<Button title="Logout" onPress={async () => signOut()} />
		</View>
	);
}
