import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface ChipProps {
	label: string;
	isToggled: boolean;
}

const Chips = ({ label, isToggled }: ChipProps) => {
	return (
		<View>
			<Text>Chips</Text>
		</View>
	);
};

export default Chips;

const styles = StyleSheet.create({});
