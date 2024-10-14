// geocodeService.ts

import { GeocodeInformation } from "@/typings/geocode.inter";

const GOOGLE_GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GOOGLE_API_KEY = "AIzaSyCdklhZaheTP04_TN0o6Do5u4Qgt3Pg5yY";

export const getCityFromPostalCode = async (
	postalCode: string,
	countryCode: string
): Promise<GeocodeInformation> => {
	try {
		const response = await fetch(
			`${GOOGLE_GEOCODING_API_URL}?components=postal_code:${postalCode}|country:${countryCode}&key=${GOOGLE_API_KEY}`
		);
		const data = await response.json();

		if (data.status === "OK" && data.results.length > 0) {
			const city = data.results[0].address_components[1].long_name;
			const province = data.results[0].address_components[3].short_name;

			return {
				city,
				province,
			};
		} else {
			return {
				city: "City not found",
				province: "N/A",
				error: "City not found",
			};
		}
	} catch (error) {
		console.error("Error fetching city:", error);
		return {
			city: "City not found",
			province: "N/A",
			error: "Error fetching city",
		};
	}
};
