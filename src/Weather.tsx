import { useState, useEffect, useCallback, useMemo } from "react";
import LocationCombobox from "./components/LocationCombobox";
import { type LocationData } from "./types/types";
import DisplayLocation from "./components/DisplayLocation";
import Header from "./components/Header";
import WeatherToday from "./components/WeatherToday";
import DailyForecast from "./components/DailyForecast";
import SevenDayHourlyForecast from "./components/SevenDayHourlyForecast";
import SevenDayHourlyForecastDisplay from "./components/SevenDayHourlyForecastDisplay";
import { useLocationData, useWeatherData } from "./hooks/react-query";

function Weather() {
    const [selectedLocation, setSelectedLocation] =
        useState<LocationData | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [query, setQuery] = useState("");

    // Debounce the search query to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // use custom hook to get location data
    const {
        isPending: isPendingLocation,
        error: errorLocation,
        data: dataLocation,
    } = useLocationData(debouncedQuery);

    // use custom hook to get weather data
    const {
        isPending: isPendingWeather,
        error: errorWeather,
        data: weatherData,
    } = useWeatherData(selectedLocation);

    const handleLocationSelect = (location: LocationData | null) => {
        setSelectedLocation(location);
        setSelectedDay("");
        console.log("Selected location:", location);
    };

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery); // This will trigger the debounced API call
    };

    const filteredLocations = dataLocation?.results || [];

    const handleDaySelect = useCallback((day: string) => {
        setSelectedDay(day);
    }, []);

    // Use useMemo to filter the hourly data. This is now derived state, not component state.
    // The calculation will only run when weatherData or selectedDay changes.
    const filteredHourlyData = useMemo(() => {
        if (!weatherData || !selectedDay) return null;

        const indices = weatherData.hourly.time
            .map((time, index) => (time.includes(selectedDay) ? index : -1))
            .filter((index) => index !== -1);

        return {
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
    }, [weatherData, selectedDay]);

    // New useEffect to automatically select the current day when weather data loads.
    useEffect(() => {
        if (weatherData && !selectedDay) {
            // Get today's date in 'YYYY-MM-DD' format
            const today = new Date().toISOString().split("T")[0];
            handleDaySelect(today);
        }
    }, [weatherData, selectedDay, handleDaySelect]);

    return (
        <div className="w-full">
            <Header />
            <main className="pt-10">
                <h1 className="text-preset-2 text-foreground text-center">
                    How&apos;s the sky looking today
                </h1>
                <div className="main-content grid grid-cols-1 pt-20 gap-8">
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

                    <div className="content-container grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="left-content col-span-2">
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
                            <div className="hourly-forecast-container bg-secondary rounded-[var(--radius-20)] py-5 px-4 max-h-[48rem] overflow-y-scroll">
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
