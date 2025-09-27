import { useReducer, useEffect, useCallback, useMemo, useState } from "react";
import LocationCombobox from "./components/LocationCombobox";
import { type LocationData, type SelectedUnits } from "./types/types";
import DisplayLocation from "./components/DisplayLocation";
import Header from "./components/Header";
import WeatherToday from "./components/WeatherToday";
import DailyForecast from "./components/DailyForecast";
import SevenDayHourlyForecast from "./components/SevenDayHourlyForecast";
import SevenDayHourlyForecastDisplay from "./components/SevenDayHourlyForecastDisplay";
import {
    useLocationData,
    useWeatherData,
    useLocationByCoords,
} from "./hooks/react-query";
import { weatherReducer } from "./utility/reducers";
import {
    convertKmhToMph,
    convertCelsiusToFehrenheit,
    convertMmToInches,
} from "./utility/convertToImperial";

function Weather() {
    const [state, dispatch] = useReducer(weatherReducer, {
        selectedLocation: null,
        selectedDay: "",
        query: "",
        debouncedQuery: "",
        enabled: false,
        selectedUnits: {
            temperature: "celsius",
            wind: "kmh",
            precipitation: "mm",
        },
    });

    const {
        selectedLocation,
        selectedDay,
        query,
        debouncedQuery,
        enabled,
        selectedUnits,
    } = state;

    // State for the user's current coordinates
    const [coords, setCoords] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    // Get location based on coords
    const {
        isPending: isPendingCoords,
        error: errorCoords,
        data: dataCoords,
    } = useLocationByCoords(coords);

    // Get user's current location on page load
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, []);

    // Set the selected location from the coordinates
    useEffect(() => {
        if (dataCoords && !selectedLocation) {
            dispatch({ type: "SET_LOCATION", payload: dataCoords });
        }
    }, [dataCoords, selectedLocation]);

    // Debounce the search query
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: "SET_DEBOUNCED_QUERY", payload: query });
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

    const handleLocationSelect = useCallback(
        (location: LocationData | null) => {
            dispatch({ type: "SET_LOCATION", payload: location });
            console.log("Selected location:", location);
        },
        []
    );

    const handleQueryChange = (newQuery: string) => {
        dispatch({ type: "SET_QUERY", payload: newQuery }); // This will trigger the debounced API call
    };

    const handleDaySelect = useCallback((day: string) => {
        dispatch({ type: "SET_DAY", payload: day });
    }, []);

    const handleSelectUnitCategory = useCallback(
        (
            category: keyof SelectedUnits,
            unit: SelectedUnits[keyof SelectedUnits]
        ) => {
            dispatch({
                type: "SET_UNIT_CATEGORY",
                payload: { category, unit },
            });
        },
        []
    );

    const handleUnitToggle = useCallback((isImperialEnabled: boolean) => {
        dispatch({ type: "SET_UNITS_TOGGLE", payload: isImperialEnabled });
    }, []);

    const filteredLocations = dataLocation?.results || [];

    // Use useMemo to convert the weather data based on the selected units
    const convertedWeatherData = useMemo(() => {
        if (!weatherData) return null;

        const convertedHourly = {
            ...weatherData.hourly,
            temperature_2m: weatherData.hourly.temperature_2m.map((temp) =>
                selectedUnits.temperature === "fahrenheit"
                    ? convertCelsiusToFehrenheit(temp)
                    : temp
            ),
            wind_speed_10m: weatherData.hourly.wind_speed_10m.map((speed) =>
                selectedUnits.wind === "mph" ? convertKmhToMph(speed) : speed
            ),
            precipitation: weatherData.hourly.precipitation.map((precip) =>
                selectedUnits.precipitation === "inches"
                    ? convertMmToInches(precip)
                    : precip
            ),
        };

        const convertedDaily = {
            ...weatherData.daily,
            temperature_2m_max: weatherData.daily.temperature_2m_max.map(
                (temp) =>
                    selectedUnits.temperature === "fahrenheit"
                        ? convertCelsiusToFehrenheit(temp)
                        : temp
            ),
            temperature_2m_min: weatherData.daily.temperature_2m_min.map(
                (temp) =>
                    selectedUnits.temperature === "fahrenheit"
                        ? convertCelsiusToFehrenheit(temp)
                        : temp
            ),
        };

        return {
            ...weatherData,
            hourly: convertedHourly,
            daily: convertedDaily,
        };
    }, [weatherData, selectedUnits]);

    // Use useMemo to filter the hourly data. This is now derived state, not component state.
    // The calculation will only run when weatherData or selectedDay changes.
    const filteredHourlyData = useMemo(() => {
        if (!convertedWeatherData || !selectedDay) return null;

        const indices = convertedWeatherData.hourly.time
            .map((time, index) => (time.includes(selectedDay) ? index : -1))
            .filter((index) => index !== -1);

        return {
            time: indices.map((i) => convertedWeatherData.hourly.time[i]),
            temperature_2m: indices.map(
                (i) => convertedWeatherData.hourly.temperature_2m[i]
            ),
            relative_humidity_2m: indices.map(
                (i) => convertedWeatherData.hourly.relative_humidity_2m[i]
            ),
            wind_speed_10m: indices.map(
                (i) => convertedWeatherData.hourly.wind_speed_10m[i]
            ),
            precipitation: indices.map(
                (i) => convertedWeatherData.hourly.precipitation[i]
            ),
            weather_code: indices.map(
                (i) => convertedWeatherData.hourly.weather_code[i]
            ),
        };
    }, [convertedWeatherData, selectedDay]);

    // New useEffect to automatically select the current day when weather data loads.
    useEffect(() => {
        if (convertedWeatherData && !selectedDay) {
            // Get today's date in 'YYYY-MM-DD' format
            const today = new Date().toISOString().split("T")[0];
            handleDaySelect(today);
        }
    }, [convertedWeatherData, selectedDay, handleDaySelect]);

    return (
        <div className="w-full">
            <Header
                enabled={enabled}
                selectedUnits={selectedUnits}
                handleUnitToggle={handleUnitToggle}
                handleSelectUnitCategory={handleSelectUnitCategory}
            />
            <main className="pt-10">
                <h1 className="text-preset-2 text-foreground text-center">
                    How&apos;s the sky looking today
                </h1>
                <div className="main-content grid grid-cols-1 pt-20 gap-y-8">
                    {/* Add loading and error states for geolocation */}
                    {!query && isPendingCoords && (
                        <div className="text-center text-preset-6 text-foreground/80">
                            Finding your current location...
                        </div>
                    )}
                    {!query && errorCoords && (
                        <div className="text-center text-preset-6 text-red-500">
                            Error finding your location. Please use the search
                            bar.
                        </div>
                    )}

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

                    <div className="content-container grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
                        <div className="left-content col-span-2">
                            <div className="weather-info-container flex flex-col gap-5 mb-6">
                                {selectedLocation && convertedWeatherData && (
                                    <DisplayLocation
                                        selectedLocation={selectedLocation}
                                        temp={
                                            convertedWeatherData?.hourly
                                                .temperature_2m ?? []
                                        }
                                        selectedUnits={selectedUnits}
                                    />
                                )}

                                {selectedLocation && convertedWeatherData && (
                                    <WeatherToday
                                        hourlyTemperature={
                                            convertedWeatherData?.hourly
                                                .temperature_2m ?? []
                                        }
                                        hourlyHumidity={
                                            convertedWeatherData?.hourly
                                                .relative_humidity_2m ?? []
                                        }
                                        hourlyWindSpeed={
                                            convertedWeatherData?.hourly
                                                .wind_speed_10m ?? []
                                        }
                                        hourlyPrecipitation={
                                            convertedWeatherData?.hourly
                                                .precipitation ?? []
                                        }
                                        selectedUnits={selectedUnits}
                                    />
                                )}
                            </div>
                            {selectedLocation && convertedWeatherData && (
                                <DailyForecast
                                    weatherData={convertedWeatherData}
                                    selectedUnits={selectedUnits}
                                />
                            )}
                        </div>
                        {selectedLocation && convertedWeatherData && (
                            <div className="hourly-forecast-container bg-secondary rounded-[var(--radius-20)] py-5 px-4 max-h-[41rem] overflow-y-scroll">
                                <SevenDayHourlyForecast
                                    weatherData={convertedWeatherData}
                                    onDaySelect={handleDaySelect}
                                    selectedDay={selectedDay}
                                />

                                {filteredHourlyData && (
                                    <div className="">
                                        <SevenDayHourlyForecastDisplay
                                            selectedDay={selectedDay}
                                            dayData={filteredHourlyData}
                                            selectedUnits={selectedUnits}
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
