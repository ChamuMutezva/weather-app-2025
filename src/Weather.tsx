import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import LocationCombobox, {
    type LocationData,
} from "./components/LocationCombobox";
import DisplayLocation from "./components/DisplayLocation";
import Header from "./components/Header";

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
                        isLoading={isPending}
                        error={error}
                    />

                    {selectedLocation && (
                        <DisplayLocation selectedLocation={selectedLocation} />
                    )}
                    <div className="content-container flex flex-col gap-8">
                        <div className="left-content">
                            <div className="weather-info-container flex flex-col gap-8">
                                
                            </div>
                            <div className="daily-forecast-container"></div>
                        </div>
                          <div className="hourly-forecast-container"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Weather;
