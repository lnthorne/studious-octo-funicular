// geocodeService.ts

import { GeocodeInformation } from "@/typings/geocode.inter";

const GOOGLE_GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GOOGLE_API_KEY = "AIzaSyCdklhZaheTP04_TN0o6Do5u4Qgt3Pg5yY";

export const getGeoInformation = async (
	postalCode: string,
	countryCode: string
): Promise<GeocodeInformation> => {
	try {
		const response = await fetch(
			`${GOOGLE_GEOCODING_API_URL}?components=postal_code:${postalCode}|country:${countryCode}&key=${GOOGLE_API_KEY}`
		);
		const data = await response.json();
		console.log("Geo data", data.results[0].geometry.location);

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
				lat: Infinity,
				lng: Infinity,
				error: "City not found",
			};
		}
	} catch (error) {
		console.error("Error fetching city:", error);
		return {
			city: "City not found",
			province: "N/A",
			lat: Infinity,
			lng: Infinity,
			error: "Error fetching city",
		};
	}
};
