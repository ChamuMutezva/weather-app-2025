export interface WeatherData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: {
        apparent_temperature: string;
        interval: string;
        is_day: string;
        rain: string;
        relative_humidity_2m: string;
        temperature_2m: string;
        time: string;
        weather_code: string;
        wind_direction_10m: string;
        wind_speed_10m: string;
        cloud_cover: string;
    };
    current: {
        apparent_temperature: number;
        interval: number;
        is_day: number;
        rain: number;
        relative_humidity_2m: number;
        temperature_2m: number;
        time: string;
        weather_code: number;
        wind_direction_10m: number;
        wind_speed_10m: number;
        cloud_cover: number;
    };
    daily_units: {
        time: string;
        temperature_2m_max: string;
        temperature_2m_min: string;
        weather_code: string;
        rain_sum: string;
        daylight_duration: string;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
        daylight_duration: number[];
        rain_sum: number[];
    };
    hourly_units: {
        time: string;
        temperature_2m: string;
        relative_humidity_2m: string;
        wind_speed_10m: string;
        precipitation: string;
        weather_code: number[];
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        precipitation: number[];
        weather_code: number[];
    };
}
export interface LocationData {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    country_code: string;
    admin1?: string;
}
export interface SelectedUnits {
    temperature: "celsius" | "fahrenheit";
    wind: "kmh" | "mph";
    precipitation: "mm" | "inches";
}

// State and Action Types
export interface WeatherState {
    selectedLocation: LocationData | null;
    selectedDay: string;
    query: string;
    debouncedQuery: string;
    enabled: boolean;
    selectedUnits: SelectedUnits;
    shouldFetchWeather: boolean;
    shouldCallReverseGeocoding: boolean;
    isInitialLoad: boolean; // State to track if this is the initial load
    coords: {
        latitude: number;
        longitude: number;
    } | null;
}

export type WeatherAction =
    | { type: "SET_LOCATION"; payload: LocationData | null }
    | { type: "SET_DAY"; payload: string }
    | { type: "SET_QUERY"; payload: string }
    | { type: "SET_DEBOUNCED_QUERY"; payload: string }
    | { type: "SET_UNITS_TOGGLE"; payload: boolean }
    | { type: "SET_FETCH_WEATHER"; payload: boolean }
    | { type: "SET_REVERSE_GEO_CODING"; payload: boolean }
    | { type: "SET_IS_INITIAL_LOAD"; payload: boolean }
    | {
          type: "SET_COORDS";
          payload: { latitude: number; longitude: number } | null;
      }
    | {
          type: "SET_UNIT_CATEGORY";
          payload: {
              category: keyof SelectedUnits;
              unit: SelectedUnits[keyof SelectedUnits];
          };
      };
