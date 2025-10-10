"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { WeatherAction, LocationData } from "../types/types"
import { areCoordsSimilar } from "../utility/checkSimilarCoords"

const LOCATION_STORAGE_KEY = "cachedLocationData"

interface Coordinates {
  latitude: number
  longitude: number
}

interface CachedLocationData {
  location: LocationData
  cachedCoords: Coordinates
  timestamp: string
}

interface UseGeolocationProps {
  dispatch: React.Dispatch<WeatherAction>
}

interface UseGeolocationReturn {
  isPending: boolean
  error: GeolocationPositionError | null
}

/**
 * Custom hook for handling geolocation with localStorage caching
 * Works with useReducer pattern by accepting a dispatch function
 *
 * Features:
 * - Automatically detects user's current location on mount
 * - Caches location data in localStorage with coordinates
 * - Compares new coordinates with cached ones to avoid unnecessary API calls
 * - Dispatches actions to update the reducer state
 * - Handles loading and error states
 *
 * @param {UseGeolocationProps} props - Object containing dispatch function
 * @returns {UseGeolocationReturn} Object containing loading and error states
 */
export function useGeolocation({ dispatch }: UseGeolocationProps): UseGeolocationReturn {
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState<GeolocationPositionError | null>(null)

  useEffect(() => {
    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      console.log("Geolocation not supported")
      setIsPending(false)
      dispatch({ type: "SET_REVERSE_GEO_CODING", payload: false })
      return
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        dispatch({ type: "SET_COORDS", payload: newCoords })
        setIsPending(false)

        // Check localStorage for existing location data
        const cachedLocationString = localStorage.getItem(LOCATION_STORAGE_KEY)

        if (cachedLocationString) {
          try {
            const parsedCachedLocation: CachedLocationData = JSON.parse(cachedLocationString)

            // Check if we have cached coordinates and if they're similar
            if (parsedCachedLocation.cachedCoords && areCoordsSimilar(newCoords, parsedCachedLocation.cachedCoords)) {
              dispatch({ type: "SET_LOCATION", payload: parsedCachedLocation.location })
              dispatch({ type: "SET_REVERSE_GEO_CODING", payload: false })
              return
            }
          } catch (parseError) {
            console.error("Error parsing cached location:", parseError)
          }
        }

        dispatch({ type: "SET_REVERSE_GEO_CODING", payload: true })
      },
      (geolocationError) => {
        console.error("Geolocation error:", geolocationError)
        setError(geolocationError)
        setIsPending(false)
        dispatch({ type: "SET_REVERSE_GEO_CODING", payload: false })
      },
    )
  }, [dispatch])

  return {
    isPending,
    error,
  }
}

/**
 * Helper function to save location data to localStorage
 *
 * @param location - The location data to cache
 * @param coords - The coordinates associated with the location
 */
export function cacheLocationData(location: LocationData, coords: Coordinates): void {
  const locationDataToCache: CachedLocationData = {
    location,
    cachedCoords: coords,
    timestamp: new Date().toISOString(),
  }

  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationDataToCache))
}

