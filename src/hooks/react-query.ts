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
                daily: [
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "weather_code",
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
          // Use the Vite proxy
            const response = await fetch(
                `/api/geocoding/reverse?latitude=${coords.latitude}&longitude=${coords.longitude}&count=1&language=en&format=json`
            );

            if (!response.ok) {
                throw new Error("Network response was not ok Nominatim API");
            }
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                throw new Error("No location found for these coordinates");
            }

            // The data structure is different from Nominatim, so we'll grab the first result
            const result = data.results[0];
            const locationData: LocationData = {
                id: result.id,
                name: result.name,
                latitude: result.latitude,
                longitude: result.longitude,
                country: result.country,
                country_code: result.country_code,
                admin1: result.admin1,
            };
            return locationData;
        },
        enabled: !!coords,
    });
};
