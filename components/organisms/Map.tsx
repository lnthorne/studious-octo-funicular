import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";

interface MapProps {
	lat: number;
	lng: number;
	radiusInM?: number;
}

const ORMap: React.FC<MapProps> = ({ lat, lng, radiusInM: radius = 700 }) => {
	return (
		<View style={styles.mapContainer}>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: lat,
					longitude: lng,
					latitudeDelta: 0.03,
					longitudeDelta: 0.03,
				}}
			>
				<Circle
					center={{
						latitude: lat,
						longitude: lng,
					}}
					radius={radius}
					strokeColor="rgba(30,144,255,0.8)"
					fillColor="rgba(30,144,255,0.3)"
				/>
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	mapContainer: {
		height: 300, // Adjust height as needed
		width: "100%",
		borderRadius: 12,
		overflow: "hidden", // Ensures the map is rounded
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
});

export default ORMap;
