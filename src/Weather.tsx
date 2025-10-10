/**
 * Weather component is the main container for the weather application.
 *
 * This component manages the overall state and logic for fetching and displaying weather data,
 * handling user location (via geolocation or search), unit conversions, and rendering the main UI.
 *
 * Features:
 * - Detects user's current location using the Geolocation API and caches it in localStorage.
 * - Allows users to search for locations using a combobox with debounced queries.
 * - Fetches weather data for the selected location using custom React Query hooks.
 * - Supports unit conversion between metric and imperial for temperature, wind speed, and precipitation.
 * - Displays current weather, daily forecast, and hourly forecast for the selected day.
 * - Integrates an AI weather advisor component for additional insights.
 * - Handles loading and error states for geolocation, location search, and weather data fetching.
 *
 * State Management:
 * - Uses useReducer for complex state (location, units, query, etc.).
 * - Uses useState for controlling fetch triggers and geolocation logic.
 * - Uses useMemo for efficient data transformation and filtering.
 *
 * UI Structure:
 * - Header with unit toggles and settings.
 * - Location search and selection.
 * - Weather data display (current, daily, hourly).
 * - AI weather advisor section.
 * - Loading skeletons and error messages for improved UX.
 *
 * Dependencies:
 * - Custom hooks: useLocationData, useWeatherData, useLocationByCoords.
 * - Utility functions for unit conversion and coordinate comparison.
 * - Multiple presentational components for displaying weather and location data.
 */
import { useReducer, useEffect, useCallback } from "react";
import type React from "react";
import LocationCombobox from "./components/LocationCombobox";
import { type LocationData, type SelectedUnits } from "./types/types";
import DisplayLocation from "./components/DisplayLocation";
import Header from "./components/Header";
import WeatherToday from "./components/WeatherToday";
import DailyForecast from "./components/DailyForecast";
import SevenDayHourlyForecast from "./components/SevenDayHourlyForecast";
import SevenDayHourlyForecastDisplay from "./components/SevenDayHourlyForecastDisplay";
import LoadingSkeleton from "./components/LoadingSkeleton";
import AIAdvisorSkeleton from "./components/AIAdvisorSkeleton";
import {
    useLocationData,
    useWeatherData,
    useLocationByCoords,
} from "./hooks/react-query";
import { weatherReducer, initialWeatherState } from "./utility/reducers";
import { useGeolocation, cacheLocationData } from "./hooks/use-geolocation";

import AIWeatherAdvisor from "./components/AIWeatherAdvisor";
import { useWeatherDataConversion } from "./hooks/use-weather-data-conversion";

function Weather() {
    const [state, dispatch] = useReducer(weatherReducer, initialWeatherState);

    const {
        selectedLocation,
        selectedDay,
        query,
        debouncedQuery,
        enabled,
        selectedUnits,
        shouldFetchWeather,
        shouldCallReverseGeocoding,
        coords,
        isInitialLoad,
    } = state;

    const { isPending: isPendingGeolocation, error: errorGeolocation } =
        useGeolocation({ dispatch });

    // Get location based on coords
    const {
        isPending: isPendingCoords,
        error: errorCoords,
        data: dataCoords,
    } = useLocationByCoords(shouldCallReverseGeocoding ? coords : null);

    // Save location data to localStorage when we get new data from reverse geocoding
    useEffect(() => {
        if (dataCoords && coords) {
            cacheLocationData(dataCoords, coords);
        }
    }, [dataCoords, coords]);

    // Set the selected location from the coordinates AND trigger weather fetch
    useEffect(() => {
        if (dataCoords && !selectedLocation) {
            dispatch({ type: "SET_LOCATION", payload: dataCoords });
            // Auto-load weather for current location
            dispatch({ type: "SET_FETCH_WEATHER", payload: true });
        }
    }, [dataCoords, selectedLocation]);

    // Also handle the case where we get location from localStorage (cached)
    useEffect(() => {
        // If we have a selectedLocation but no weather fetch triggered yet, and it's initial load
        if (selectedLocation && isInitialLoad) {
            dispatch({ type: "SET_FETCH_WEATHER", payload: true });
        }
    }, [selectedLocation, isInitialLoad]);

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
    } = useWeatherData(
        shouldFetchWeather || (isInitialLoad && selectedLocation)
            ? selectedLocation
            : null
    );

    const filteredLocations = dataLocation?.results || [];

    const { convertedWeatherData, filteredHourlyData } =
        useWeatherDataConversion(weatherData, selectedUnits, selectedDay);

    const handleLocationSelect = useCallback(
        (location: LocationData | null) => {
            dispatch({ type: "SET_LOCATION", payload: location });
            // Reset the fetch trigger when location changes
            dispatch({ type: "SET_FETCH_WEATHER", payload: true });
            // Mark that initial load is complete
            dispatch({ type: "SET_IS_INITIAL_LOAD", payload: false });
        },
        []
    );

    const handleSubmit = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault(); // Prevent default form submission
            if (selectedLocation) {
                dispatch({ type: "SET_FETCH_WEATHER", payload: true });
                // Mark that initial load is complete
                dispatch({ type: "SET_IS_INITIAL_LOAD", payload: false });
            }
        },
        [selectedLocation]
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

    // New useEffect to automatically select the current day when weather data loads.
    useEffect(() => {
        if (convertedWeatherData && !selectedDay) {
            // Get today's date in 'YYYY-MM-DD' format
            const today = new Date().toISOString().split("T")[0];
            handleDaySelect(today);
        }
    }, [convertedWeatherData, selectedDay, handleDaySelect]);

    const showWeatherData =
        (shouldFetchWeather || isInitialLoad) &&
        selectedLocation &&
        convertedWeatherData;
    const showLoadingSkeleton =
        (shouldFetchWeather || isInitialLoad) &&
        isPendingWeather &&
        selectedLocation;
    const showPendingFindingLocation =
        !query &&
        (isPendingCoords || isPendingGeolocation) &&
        shouldCallReverseGeocoding;
    const showErrorFindingLocation =
        !query && (errorCoords || errorGeolocation);

    console.log("weather-data", weatherData)

    return (
        <div className="w-full">
            <Header
                enabled={enabled}
                selectedUnits={selectedUnits}
                handleUnitToggle={handleUnitToggle}
                handleSelectUnitCategory={handleSelectUnitCategory}
            />
            <main className="pt-10 lg:pt-16">
                <h1 className="text-preset-2 text-foreground text-center">
                    How&apos;s the sky looking today?
                </h1>
                <div className="main-content grid grid-cols-1 pt-16 gap-y-12 mb-10">
                    {/* Add loading and error states for geolocation */}
                    {showPendingFindingLocation && (
                        <div
                            className="text-center text-preset-6 text-foreground/80"
                            aria-live="polite"
                        >
                            <p>Finding your current location...</p>
                        </div>
                    )}
                    {showErrorFindingLocation && (
                        <div
                            className="text-center text-preset-6 text-red-500"
                            aria-live="assertive"
                        >
                            <p>
                                Error finding your location. Please use the
                                search bar.
                            </p>
                        </div>
                    )}

                    <LocationCombobox
                        onLocationSelect={handleLocationSelect}
                        onQueryChange={handleQueryChange}
                        onSubmit={handleSubmit}
                        selectedLocation={selectedLocation}
                        locations={filteredLocations}
                        isLoading={isPendingLocation}
                        isPendingCoords={
                            isPendingCoords && shouldCallReverseGeocoding
                        }
                        error={errorLocation}
                    />

                    {/* Weather data loading and error states */}
                    {showLoadingSkeleton && <LoadingSkeleton />}

                    {(shouldFetchWeather || isInitialLoad) && errorWeather && (
                        <div
                            className="text-center text-preset-6 text-red-500"
                            aria-live="assertive"
                        >
                            <p>
                                Error loading weather data:{" "}
                                {errorWeather.message}
                            </p>
                        </div>
                    )}
                    {showWeatherData && (
                        <div className="content-container grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
                            <div className="left-content col-span-2">
                                <div className="weather-info-container flex flex-col gap-6 mb-6 lg:mb-10 lg:gap-10">
                                    <DisplayLocation
                                        selectedLocation={selectedLocation}
                                        temp={
                                            convertedWeatherData?.current
                                                .temperature_2m ?? 0
                                        }
                                        selectedUnits={selectedUnits}
                                    />

                                    <WeatherToday
                                        hourlyTemperature={
                                            convertedWeatherData?.current
                                                .apparent_temperature ?? ""
                                        }
                                        hourlyHumidity={
                                            convertedWeatherData?.current
                                                .relative_humidity_2m ?? ""
                                        }
                                        hourlyWindSpeed={
                                            convertedWeatherData?.current
                                                .wind_speed_10m ?? ""
                                        }
                                        hourlyPrecipitation={
                                            convertedWeatherData?.current
                                                .rain ?? ""
                                        }
                                        selectedUnits={selectedUnits}
                                        period={convertedWeatherData?.current.is_day ?? null}
                                        cloudCover={convertedWeatherData?.current.cloud_cover ?? 0}
                                    />
                                </div>

                                <DailyForecast
                                    weatherData={convertedWeatherData}
                                    selectedUnits={selectedUnits}
                                />
                            </div>

                            <div className="hourly-forecast-container bg-secondary rounded-[var(--radius-20)] pb-5 px-4  h-[40rem] lg:contain-size lg:h-full overflow-y-scroll">
                                <SevenDayHourlyForecast
                                    weatherData={convertedWeatherData}
                                    onDaySelect={handleDaySelect}
                                    selectedDay={selectedDay}
                                />

                                {filteredHourlyData && (
                                    <SevenDayHourlyForecastDisplay
                                        selectedDay={selectedDay}
                                        dayData={filteredHourlyData}
                                        selectedUnits={selectedUnits}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Show AI Advisor skeleton while loading */}
                {showLoadingSkeleton && <AIAdvisorSkeleton />}

                {showWeatherData && (
                    <AIWeatherAdvisor
                        weatherData={convertedWeatherData}
                        selectedUnits={selectedUnits}
                        selectedLocation={selectedLocation}
                    />
                )}
            </main>
        </div>
    );
}

export default Weather;
