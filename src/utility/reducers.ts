import { type WeatherState, type WeatherAction } from "../types/types";

export const initialWeatherState = {
    selectedLocation: null,
    selectedDay: "",
    query: "",
    debouncedQuery: "",
    enabled: false,
    selectedUnits: {
        temperature: "celsius" as "celsius" | "fahrenheit",
        wind: "kmh" as "kmh" | "mph",
        precipitation: "mm" as "mm" | "inches",
    },
    shouldFetchWeather: false,
    shouldCallReverseGeocoding: false,
    isInitialLoad: true,
    coords: null,
};

export const weatherReducer = (
    state: WeatherState,
    action: WeatherAction
): WeatherState => {
    switch (action.type) {
        case "SET_LOCATION":
            return {
                ...state,
                selectedLocation: action.payload,
                selectedDay: "", // Reset the day when the location changes
            };
        case "SET_DAY":
            return {
                ...state,
                selectedDay: action.payload,
            };
        case "SET_QUERY":
            return {
                ...state,
                query: action.payload,
            };
        case "SET_DEBOUNCED_QUERY":
            return {
                ...state,
                debouncedQuery: action.payload,
            };
        case "SET_UNITS_TOGGLE": {
            const isImperialEnabled = action.payload;
            return {
                ...state,
                enabled: isImperialEnabled,
                selectedUnits: isImperialEnabled
                    ? {
                          temperature: "fahrenheit",
                          wind: "mph",
                          precipitation: "inches",
                      }
                    : {
                          temperature: "celsius",
                          wind: "kmh",
                          precipitation: "mm",
                      },
            };
        }
        case "SET_UNIT_CATEGORY":
            return {
                ...state,
                selectedUnits: {
                    ...state.selectedUnits,
                    [action.payload.category]: action.payload.unit,
                },
            };
        case "SET_FETCH_WEATHER":
            return {
                ...state,
                shouldFetchWeather: action.payload,
            };
        case "SET_IS_INITIAL_LOAD":
            return {
                ...state,
                isInitialLoad: action.payload,
            };
        case "SET_COORDS":
            return {
                ...state,
                coords: action.payload,
            };
        case "SET_REVERSE_GEO_CODING":
            return {
                ...state,
                shouldCallReverseGeocoding: action.payload,
            };
        default:
            return state;
    }
};
