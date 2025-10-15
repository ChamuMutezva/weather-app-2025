/**
 * DisplayLocation component renders weather information for a selected location.
 *
 * @remarks
 * This component displays the name, administrative region, country, and current date
 * for the selected location, along with the temperature in the selected units (Celsius or Fahrenheit).
 * It also shows a weather icon (currently hardcoded as sunny).
 * If no location is selected, the component renders nothing.
 *
 * @param props - The props for the DisplayLocation component.
 * @param props.selectedLocation - The location data to display, or null if none is selected.
 * @param props.temp - The temperature value to display.
 * @param props.selectedUnits - The selected units for temperature display.
 *
 * @returns The rendered weather information for the selected location, or null if no location is selected.
 */

// import { useState, useEffect } from "react";
import { type LocationData, type SelectedUnits } from "../types/types";
interface DisplayLocationProps {
    selectedLocation: LocationData | null;
    temp: number;
    selectedUnits: SelectedUnits;
}

function DisplayLocation({
    selectedLocation,
    temp,
    selectedUnits,
}: Readonly<DisplayLocationProps>) {
  //  const [currentTime, setCurrentTime] = useState<string>("");
   
    // Use useEffect to handle client-side time rendering to avoid hydration mismatch
    /*
    useEffect(() => {
             
       // Set initial time
        setCurrentTime(new Date().toLocaleString());

        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
*/
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    if (!selectedLocation) {
        return null;
    }

    const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className={`weather-info shadow-card-dark shadow-card-light  
         bg-no-repeat bg-cover rounded-[var(--radius-24)]
         p-4 min-h-71.5 w-full flex flex-col justify-center items-center md:flex-row md:justify-between gap-4`}
        >
            <div className="flex flex-col items-center md:items-start gap-2">
                <h2 className="text-preset-4 text-foreground text-center md:text-left">{`${selectedLocation.name}, ${selectedLocation.admin1}`}</h2>
                <p className="text-preset-5 text-foreground text-center md:text-left">
                    {selectedLocation.country}
                </p>
                <time
                    dateTime={new Date().toISOString()}
                    className="text-preset-6 text-foreground opacity-80"
                >
                    {formatDate(new Date())}
                </time>
            </div>
            <div className="grid grid-cols-2 place-items-center">
                <img
                    src="/assets/images/icon-sunny.webp"
                    alt=""
                    className="w-30 h-30"
                />
                <p className="text-preset-1 text-foreground">
                    {`${Math.round(temp)}`}
                    <span>{tempUnit}</span>
                </p>
            </div>
        </div>
    );
}

export default DisplayLocation;
