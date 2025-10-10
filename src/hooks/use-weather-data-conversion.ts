"use client"

import { useMemo } from "react"
import type { WeatherData, SelectedUnits } from "../types/types"
import { convertCelsiusToFehrenheit, convertKmhToMph, convertMmToInches } from "../utility/convertToImperial"

interface FilteredHourlyData {
  time: string[]
  temperature_2m: number[]
  relative_humidity_2m: number[]
  wind_speed_10m: number[]
  precipitation: number[]
  weather_code: number[]
}

interface UseWeatherDataConversionReturn {
  convertedWeatherData: WeatherData | null
  filteredHourlyData: FilteredHourlyData | null
}

/**
 * Custom hook to convert weather data based on selected units and filter hourly data for a specific day.
 *
 * @param weatherData - The raw weather data from the API
 * @param selectedUnits - The user's selected unit preferences (temperature, wind, precipitation)
 * @param selectedDay - The selected day in 'YYYY-MM-DD' format for filtering hourly data
 * @returns An object containing convertedWeatherData and filteredHourlyData
 */
export function useWeatherDataConversion(
  weatherData: WeatherData | null | undefined,
  selectedUnits: SelectedUnits,
  selectedDay: string | null,
): UseWeatherDataConversionReturn {
  // Convert weather data based on selected units
  const convertedWeatherData = useMemo(() => {
    if (!weatherData) return null

    const convertedHourly = {
      ...weatherData.hourly,
      temperature_2m: weatherData.hourly.temperature_2m.map((temp) =>
        selectedUnits.temperature === "fahrenheit" ? convertCelsiusToFehrenheit(temp) : temp,
      ),
      wind_speed_10m: weatherData.hourly.wind_speed_10m.map((speed) =>
        selectedUnits.wind === "mph" ? convertKmhToMph(speed) : speed,
      ),
      precipitation: weatherData.hourly.precipitation.map((precip) =>
        selectedUnits.precipitation === "inches" ? convertMmToInches(precip) : precip,
      ),
    }

    const convertedDaily = {
      ...weatherData.daily,
      temperature_2m_max: weatherData.daily.temperature_2m_max.map((temp) =>
        selectedUnits.temperature === "fahrenheit" ? convertCelsiusToFehrenheit(temp) : temp,
      ),
      temperature_2m_min: weatherData.daily.temperature_2m_min.map((temp) =>
        selectedUnits.temperature === "fahrenheit" ? convertCelsiusToFehrenheit(temp) : temp,
      ),
    }

    const convertedCurrent = {
      ...weatherData.current,
      apparent_temperature:
        selectedUnits.temperature === "fahrenheit"
          ? convertCelsiusToFehrenheit(weatherData.current.apparent_temperature)
          : weatherData.current.apparent_temperature,
      temperature_2m:
        selectedUnits.temperature === "fahrenheit"
          ? convertCelsiusToFehrenheit(weatherData.current.temperature_2m)
          : weatherData.current.temperature_2m,
      rain:
        selectedUnits.precipitation === "inches"
          ? convertMmToInches(weatherData.current.rain)
          : weatherData.current.rain,
      wind_speed_10m:
        selectedUnits.wind === "mph"
          ? convertKmhToMph(weatherData.current.wind_speed_10m)
          : weatherData.current.wind_speed_10m,
    }

    return {
      ...weatherData,
      hourly: convertedHourly,
      daily: convertedDaily,
      current: convertedCurrent,
    }
  }, [weatherData, selectedUnits])

  // Filter hourly data for the selected day
  const filteredHourlyData = useMemo(() => {
    if (!convertedWeatherData || !selectedDay) return null

    const indices = convertedWeatherData.hourly.time
      .map((time, index) => (time.includes(selectedDay) ? index : -1))
      .filter((index) => index !== -1)

    return {
      time: indices.map((i) => convertedWeatherData.hourly.time[i]),
      temperature_2m: indices.map((i) => convertedWeatherData.hourly.temperature_2m[i]),
      relative_humidity_2m: indices.map((i) => convertedWeatherData.hourly.relative_humidity_2m[i]),
      wind_speed_10m: indices.map((i) => convertedWeatherData.hourly.wind_speed_10m[i]),
      precipitation: indices.map((i) => convertedWeatherData.hourly.precipitation[i]),
      weather_code: indices.map((i) => convertedWeatherData.hourly.weather_code[i]),
    }
  }, [convertedWeatherData, selectedDay])

  return {
    convertedWeatherData,
    filteredHourlyData,
  }
}
