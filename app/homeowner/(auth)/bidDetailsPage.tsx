import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useJobContext } from "@/contexts/jobContext";
import { ATText } from "@/components/atoms/Text";

export default function bidDetailsPage() {
	const { selectedBid } = useJobContext();
	return (
		<SafeAreaView>
			<Text>bidDetailsPage</Text>
			<ATText>{selectedBid?.companyName}</ATText>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({});
