import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import LocationCombobox, {
    type LocationData,
} from "./components/LocationCombobox";
import DisplayLocation from "./components/DisplayLocation";
import Header from "./components/Header";
import WeatherToday from "./components/WeatherToday";
import DailyForecast from "./components/DailyForecast";
import SevenDayHourlyForecast from "./components/SevenDayHourlyForecast";
import SevenDayHourlyForecastDisplay from "./components/SevenDayHourlyForecastDisplay";
import { type WeatherData } from "./types/types";

function Weather() {
    const [selectedLocation, setSelectedLocation] =
        useState<LocationData | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [query, setQuery] = useState("");

    const [filteredHourlyData, setFilteredHourlyData] = useState<{
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        precipitation: number[];
        weather_code: number[];
    } | null>(null);

    // Debounce the search query to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Get location data based on the debounced query
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

    // Get weather data based on the selected location
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

            // convert params to query string
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

    /* Log weather data for debugging
    useEffect(() => {
        if (weatherData) {
            console.log("Weather data:", weatherData);
        }
    }, [weatherData]);
*/
    const handleDaySelect = (day: string) => {
        setSelectedDay(day);
        // console.log(`Selected day in parent: ${selectedDay}`);
        if (weatherData) {
            const indices = weatherData.hourly.time
                .map((time, index) => (time.includes(day) ? index : -1))
                .filter((index) => index !== -1);

            const filteredData = {
                time: indices.map((i) => weatherData.hourly.time[i]),
                temperature_2m: indices.map(
                    (i) => weatherData.hourly.temperature_2m[i]
                ),
                relative_humidity_2m: indices.map(
                    (i) => weatherData.hourly.relative_humidity_2m[i]
                ),
                wind_speed_10m: indices.map(
                    (i) => weatherData.hourly.wind_speed_10m[i]
                ),
                precipitation: indices.map(
                    (i) => weatherData.hourly.precipitation[i]
                ),
                weather_code: indices.map(
                    (i) => weatherData.hourly.weather_code[i]
                ),
            };

            setFilteredHourlyData(filteredData);
            // console.log("Filtered hourly data:", filteredData);
        }
    };

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
                            <div className="weather-info-container flex flex-col gap-8">
                                {selectedLocation && (
                                    <DisplayLocation
                                        selectedLocation={selectedLocation}
                                        temp={
                                            weatherData?.hourly
                                                .temperature_2m ?? []
                                        }
                                    />
                                )}

                                {selectedLocation && (
                                    <WeatherToday
                                        hourlyTemperature={
                                            weatherData?.hourly
                                                .temperature_2m ?? []
                                        }
                                        hourlyHumidity={
                                            weatherData?.hourly
                                                .relative_humidity_2m ?? []
                                        }
                                        hourlyWindSpeed={
                                            weatherData?.hourly
                                                .wind_speed_10m ?? []
                                        }
                                        hourlyPrecipitation={
                                            weatherData?.hourly.precipitation ??
                                            []
                                        }
                                    />
                                )}
                            </div>
                            {selectedLocation && weatherData && (
                                <DailyForecast weatherData={weatherData} />
                            )}
                        </div>
                        {selectedLocation && weatherData && (
                            <div className="hourly-forecast-container bg-secondary rounded-[var(--radius-20)] py-5 px-4">
                                <SevenDayHourlyForecast
                                    weatherData={weatherData}
                                    onDaySelect={handleDaySelect}
                                />

                                {filteredHourlyData && (
                                    <div className="">
                                        <SevenDayHourlyForecastDisplay
                                            selectedDay={selectedDay}
                                            dayData={filteredHourlyData}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Weather;
