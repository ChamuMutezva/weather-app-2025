import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import LocationCombobox, {
    type LocationData,
} from "./components/LocationCombobox";
import DisplayLocation from "./components/DisplayLocation";
import Header from "./components/Header";

interface WeatherData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    hourly_units: {
        time: string;
        temperature_2m: string;
        relative_humidity_2m: string;
        wind_speed_10m: string;
        precipitation: string;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        precipitation: number[];
    };
}

function Weather() {
    const [selectedLocation, setSelectedLocation] =
        useState<LocationData | null>(null);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [query, setQuery] = useState("");

    // Debounce the search query to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const {
        isPending: isPendingLocation,
        error: errorLocation,
        data: dataLocation,
    } = useQuery({
        queryKey: ["locationData", debouncedQuery],
        queryFn: () => {
            if (!debouncedQuery.trim()) return { results: [] };

            return fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${debouncedQuery}&count=10&language=en&format=json`
            ).then((res) => res.json());
        },
        enabled: debouncedQuery.length > 0,
    });

    const {
        isPending: isPendingWeather,
        error: errorWeather,
        data: weatherData,
    } = useQuery<WeatherData>({
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
                hourly: [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "precipitation",
                ],
                forecast_days: 14,
            };

            // convert params to query string
            const queryParams = new URLSearchParams();
            queryParams.append("latitude", params.latitude.toString());
            queryParams.append("longitude", params.longitude.toString());
            queryParams.append("hourly", params.hourly.join(","));
            queryParams.append(
                "forecast_days",
                params.forecast_days.toString()
            );

            const url = `https://api.open-meteo.com/v1/forecast?${queryParams.toString()}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Weather API  error: ${response.status}`);
            }
            return response.json() as Promise<WeatherData>;
        },
        enabled: !!selectedLocation, // only run if a location is selected
    });

    const handleLocationSelect = (location: LocationData | null) => {
        setSelectedLocation(location);
        console.log("Selected location:", location);
    };

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery); // This will trigger the debounced API call
    };

    const filteredLocations = dataLocation?.results || [];

    // Log weather data for debugging
    useEffect(() => {
        if (weatherData) {
            console.log("Weather data:", weatherData);
        }
    }, [weatherData]);

    return (
        <div className="w-full">
            <Header />
            <main className="pt-10">
                <h1 className="text-preset-2 text-foreground text-center">
                    How is the sky looking today
                </h1>
                <div className="main-content flex flex-col pt-20 gap-8">
                    <LocationCombobox
                        onLocationSelect={handleLocationSelect}
                        onQueryChange={handleQueryChange}
                        selectedLocation={selectedLocation}
                        locations={filteredLocations}
                        isLoading={isPendingLocation}
                        error={errorLocation}
                    />

                    {selectedLocation && (
                        <DisplayLocation selectedLocation={selectedLocation} />
                    )}

                    {/* Weather data loading and error states */}
                    {isPendingWeather && selectedLocation && (
                        <div className="text-center text-preset-6 text-foreground/80">
                            Loading weather data...
                        </div>
                    )}

                    {errorWeather && (
                        <div className="text-center text-preset-6 text-red-500">
                            Error loading weather data: {errorWeather.message}
                        </div>
                    )}

                    <div className="content-container flex flex-col gap-8">
                        <div className="left-content">
                            <div className="weather-info-container flex flex-col gap-8"></div>
                            <div className="daily-forecast-container"></div>
                        </div>
                        <div className="hourly-forecast-container"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Weather;
