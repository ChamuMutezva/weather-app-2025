import { useQuery } from "@tanstack/react-query";
import { type LocationData, type WeatherData } from "../types/types";

// Custom hook to fetch location data
export const useLocationData = (query: string) => {
    return useQuery({
        queryKey: [useLocationData, query],
        queryFn: async () => {
            if (!query.trim()) return { results: [] };

            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`
            );

            if (!response.ok) {
                throw new Error("Location API error");
            }
            return response.json();
        },
        enabled: query.trim().length > 0,
    });
};

// Custom hook to fetch weather data
export const useWeatherData = (selectedLocation: LocationData | null) => {
    return useQuery<WeatherData>({
        queryKey: [
            "weatherData",
            selectedLocation?.latitude,
            selectedLocation?.longitude,
        ],
        queryFn: async () => {
            if (!selectedLocation) throw new Error("No location selected");

            const params = {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                current: [
                    "temperature_2m",
                    "wind_speed_10m",
                    "relative_humidity_2m",
                    "rain",
                    "apparent_temperature",
                    "is_day",
                    "weather_code",
                    "wind_direction_10m",
                    "cloud_cover",
                ],
                daily: [
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "weather_code",
                    "daylight_duration",
                    "rain_sum",
                ],
                hourly: [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "precipitation",
                    "weather_code",
                ],
                forecast_days: 7,
            };

            const queryParams = new URLSearchParams();
            queryParams.append("latitude", params.latitude.toString());
            queryParams.append("longitude", params.longitude.toString());
            queryParams.append("current", params.current.join(","));
            queryParams.append("hourly", params.hourly.join(","));
            queryParams.append("daily", params.daily.join(","));
            queryParams.append(
                "forecast_days",
                params.forecast_days.toString()
            );

            const url = `https://api.open-meteo.com/v1/forecast?${queryParams.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            return response.json() as Promise<WeatherData>;
        },
        enabled: !!selectedLocation,
    });
};

export const useLocationByCoords = (
    coords: { latitude: number; longitude: number } | null
) => {
    return useQuery<LocationData, Error>({
        queryKey: ["location-by-coords", coords],
        queryFn: async () => {
            if (!coords) {
                throw new Error("Coordinates are not provided");
            }
            // Direct call to Nominatim with proper headers
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        "User-Agent": "WeatherApp/1.0 (chamu@preprince.co.za)",
                        "Accept-Language": "en",
                    },
                }
            );

            console.log("Nominatim response status:", response.status);

            if (!response.ok) {
                throw new Error("Network response was not ok Nominatim API");
            }
            const data = await response.json();
            console.log("Nominatim full response:", data);

            if (!data.address) {
                throw new Error("No location found for these coordinates");
            }
            // The data structure is different from Nominatim, so we'll grab the first result
            const locationData: LocationData = {
                id: data.place_id.toString(),
                name: data.address.town || "Unknown Location",
                latitude: parseFloat(data.lat),
                longitude: parseFloat(data.lon),
                country: data.address.country || "",
                country_code: data.address.country_code || "",
                admin1: data.address.state || data.address.county || "",
                // You can add more fields if needed:
                //  city: data.address.city || data.address.town || data.address.village,
                // postcode: data.address.postcode,
            };

            return locationData;
        },
        enabled: !!coords,
    });
};
