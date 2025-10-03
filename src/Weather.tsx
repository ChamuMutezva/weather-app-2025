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
import { weatherReducer, initialWeatherState } from "./utility/reducers";
import {
    convertKmhToMph,
    convertCelsiusToFehrenheit,
    convertMmToInches,
} from "./utility/convertToImperial";
import { areCoordsSimilar } from "./utility/checkSimilarCoords";
import AIWeatherAdvisor from "./components/AIWeatherAdvisor";

const LOCATION_STORAGE_KEY = "cachedLocationData";

function Weather() {
    const [state, dispatch] = useReducer(weatherReducer, initialWeatherState);

    const {
        selectedLocation,
        selectedDay,
        query,
        debouncedQuery,
        enabled,
        selectedUnits,
    } = state;

    // Add state to control when to fetch weather data
    const [shouldFetchWeather, setShouldFetchWeather] = useState(false);
    // Add state to track if this is the initial load
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // State for the user's current coordinates
    const [coords, setCoords] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);

    // State to control when to call reverse geocoding
    const [shouldCallReverseGeocoding, setShouldCallReverseGeocoding] =
        useState(false);

    // Get location based on coords
    const {
        isPending: isPendingCoords,
        error: errorCoords,
        data: dataCoords,
    } = useLocationByCoords(shouldCallReverseGeocoding ? coords : null);

    // Get user's current location on page load
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCoords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    setCoords(newCoords);

                    // Check localStorage for existing location data
                    const cachedLocation =
                        localStorage.getItem(LOCATION_STORAGE_KEY);

                    if (cachedLocation) {
                        try {
                            const parsedCachedLocation =
                                JSON.parse(cachedLocation);

                            // Check if we have cached coordinates and if they're similar
                            if (
                                parsedCachedLocation.cachedCoords &&
                                areCoordsSimilar(
                                    newCoords,
                                    parsedCachedLocation.cachedCoords
                                )
                            ) {
                                dispatch({
                                    type: "SET_LOCATION",
                                    payload: parsedCachedLocation.location,
                                });
                                setShouldCallReverseGeocoding(false);
                                return;
                            }
                        } catch (error) {
                            console.error(
                                "Error parsing cached location:",
                                error
                            );
                        }
                    }

                    // If no cached data or coordinates changed significantly, call reverse geocoding
                    setShouldCallReverseGeocoding(true);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setShouldCallReverseGeocoding(false);
                }
            );
        } else {
            console.log("Geolocation not supported");
            setShouldCallReverseGeocoding(false);
        }
    }, []);

    // Save location data to localStorage when we get new data from reverse geocoding
    useEffect(() => {
        if (dataCoords && coords) {
            const locationDataToCache = {
                location: dataCoords,
                cachedCoords: coords,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(
                LOCATION_STORAGE_KEY,
                JSON.stringify(locationDataToCache)
            );
        }
    }, [dataCoords, coords]);

    // Set the selected location from the coordinates AND trigger weather fetch
    useEffect(() => {
        if (dataCoords && !selectedLocation) {
            dispatch({ type: "SET_LOCATION", payload: dataCoords });
            // Auto-load weather for current location
            setShouldFetchWeather(true);
        }
    }, [dataCoords, selectedLocation]);

     // Also handle the case where we get location from localStorage (cached)
    useEffect(() => {
        // If we have a selectedLocation but no weather fetch triggered yet, and it's initial load
        if (selectedLocation && isInitialLoad) {
            setShouldFetchWeather(true);
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

    const handleLocationSelect = useCallback(
        (location: LocationData | null) => {
            dispatch({ type: "SET_LOCATION", payload: location });
            // Reset the fetch trigger when location changes
            setShouldFetchWeather(false);
            // Mark that initial load is complete
            setIsInitialLoad(false);
        },
        []
    );

    const handleSubmit = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault(); // Prevent default form submission
            if (selectedLocation) {
                setShouldFetchWeather(true);
                // Mark that initial load is complete
                setIsInitialLoad(false);
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

    const filteredLocations = dataLocation?.results || [];

    // Use useMemo to convert the weather data based on the selected units
    const convertedWeatherData = useMemo(() => {
        if (!weatherData) return null;
        console.log("weatherData:", weatherData);
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

        const convertedCurrent = {
            ...weatherData.current,
            apparent_temperature:
                selectedUnits.temperature === "fahrenheit"
                    ? convertCelsiusToFehrenheit(
                          weatherData.current.apparent_temperature
                      )
                    : weatherData.current.apparent_temperature,
            relative_humidity_2m: weatherData.current.relative_humidity_2m,
            rain:
                selectedUnits.precipitation === "inches"
                    ? convertMmToInches(weatherData.current.rain)
                    : weatherData.current.rain,
            wind_speed_10m:
                selectedUnits.wind === "mph"
                    ? convertKmhToMph(weatherData.current.wind_speed_10m)
                    : weatherData.current.wind_speed_10m,
            time: weatherData.current.time,
            cloud_cover: weatherData.current.cloud_cover,

            /* interval: number;
        is_day: boolean;
        rain: number;      
        
        time: string;
        weather_code: number;
        wind_direction_10m: number;
        wind_speed_10m: number;*/
        };

        return {
            ...weatherData,
            hourly: convertedHourly,
            daily: convertedDaily,
            current: convertedCurrent,
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

      const showWeatherData = (shouldFetchWeather || isInitialLoad) && selectedLocation && convertedWeatherData;

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
                    {!query &&
                        isPendingCoords &&
                        shouldCallReverseGeocoding && (
                            <div
                                className="text-center text-preset-6 text-foreground/80"
                                aria-live="polite"
                            >
                                <p>Finding your current location...</p>
                            </div>
                        )}
                    {!query && errorCoords && (
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
                    {( shouldFetchWeather || isInitialLoad ) &&
                        isPendingWeather &&
                        selectedLocation && (
                            <div
                                className="text-center text-preset-6 text-foreground/80"
                                aria-live="polite"
                            >
                                <p>Loading weather data...</p>
                            </div>
                        )}

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
                    {showWeatherData  && (
                            <div className="content-container grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
                                <div className="left-content col-span-2">
                                    <div className="weather-info-container flex flex-col gap-6 mb-6 lg:mb-10 lg:gap-10">
                                        <DisplayLocation
                                            selectedLocation={selectedLocation}
                                            temp={
                                                convertedWeatherData?.hourly
                                                    .temperature_2m ?? []
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
                                            time={
                                                convertedWeatherData.current
                                                    .time
                                            }
                                            selectedUnits={selectedUnits}
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
                                        <div className="">
                                            <SevenDayHourlyForecastDisplay
                                                selectedDay={selectedDay}
                                                dayData={filteredHourlyData}
                                                selectedUnits={selectedUnits}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
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
