import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import LocationCombobox, {
    type LocationData,
} from "./components/LocationComboBox";
import DisplayLocation from "./components/DisplayLocation";

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

    const { isPending, error, data } = useQuery({
        queryKey: ["weatherData", debouncedQuery],
        queryFn: () => {
            if (!debouncedQuery.trim()) return { results: [] };

            return fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${debouncedQuery}&count=10&language=en&format=json`
            ).then((res) => res.json());
        },
        enabled: debouncedQuery.length > 0,
    });

    const handleLocationSelect = (location: LocationData | null) => {
        setSelectedLocation(location);
        console.log("Selected location:", location);
    };

    const handleQueryChange = (newQuery: string) => {
        setQuery(newQuery); // This will trigger the debounced API call
    };

    const filteredLocations = data?.results || [];

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Weather Location Search
            </h1>

            <LocationCombobox
                onLocationSelect={handleLocationSelect}
                onQueryChange={handleQueryChange}
                selectedLocation={selectedLocation}
                locations={filteredLocations}
                isLoading={isPending}
                error={error}
            />

            {selectedLocation && (
               <DisplayLocation selectedLocation={selectedLocation} />
            )}
        </div>
    );
}

export default Weather;
