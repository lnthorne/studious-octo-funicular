import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackSource } from "expo-av";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import GeneralModal from "./generalModal";
import { View } from "react-native-ui-lib";
import useAnimation from "@/hooks/useAnimation";

interface Props {
	source: AVPlaybackSource;
}

const Help = ({ source }: Props) => {
	const isSkippable = true;
	const { startAnimation } = useAnimation();
	const [showModal, setShowModal] = useState(false);

	const handleCancel = () => {
		setShowModal(false);
	};

	const handleStartVideo = () => {
		setShowModal(false);
		startAnimation(source, () => {}, isSkippable);
	};

	return (
		<View style={{ marginRight: 8 }}>
			<TouchableOpacity onPress={() => setShowModal(true)}>
				<Ionicons name="help-outline" size={32} />
			</TouchableOpacity>

			<GeneralModal
				visible={showModal}
				description="Do you want to watch the tutorial again?"
				onCancel={handleCancel}
				onDone={handleStartVideo}
			/>
		</View>
	);
};

export default Help;
