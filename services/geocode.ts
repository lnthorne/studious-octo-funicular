import { GeocodeInformation } from "@/typings/geocode.inter";
import { getApp } from "@react-native-firebase/app";
import Constants from "expo-constants";

const GOOGLE_GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const app = getApp();
const apiKey = app.options.apiKey;
const bundle = Constants.expoConfig?.ios?.bundleIdentifier;

export const getGeoInformation = async (
	postalCode: string,
	countryCode: string
): Promise<GeocodeInformation> => {
	try {
		const response = await fetch(
			`${GOOGLE_GEOCODING_API_URL}?components=postal_code:${postalCode}|country:${countryCode}&key=${apiKey}`,
			{
				headers: {
					"X-Ios-Bundle-Identifier": bundle || "",
				},
			}
		);
		const data = await response.json();
		console.log("CAUTION", data);

		if (data.status === "OK" && data.results.length > 0) {
			const city: string = data.results[0].address_components[1].long_name;
			const province: string = data.results[0].address_components[3].short_name;
			const lat: number = parseFloat(data.results[0].geometry.location.lat);
			const lng: number = parseFloat(data.results[0].geometry.location.lng);

			return {
				city,
				province,
				lat,
				lng,
			};
		} else {
			return {
				city: "City not found",
				province: "N/A",
				lat: 90,
				lng: -90,
				error: "City not found",
			};
		}
	} catch (error) {
		console.error("Error fetching city:", error);
		return {
			city: "City not found",
			province: "N/A",
			lat: 90,
			lng: -90,
			error: "Error fetching city",
		};
	}
};
