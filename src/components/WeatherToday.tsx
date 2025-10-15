import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { type SelectedUnits, type WeatherData } from "../types/types";
import WeatherTodaySecondary from "./WeatherTodaySecondary";

type WeatherTodayProps = {
    currentData: WeatherData["current"] | null | undefined;
    selectedUnits: SelectedUnits;
};

function WeatherToday({
    currentData,
    selectedUnits,
}: Readonly<WeatherTodayProps>) {
    const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";
    const windUnit = selectedUnits.wind === "kmh" ? "km/h" : "mph";
    const precipitationUnit =
        selectedUnits.precipitation === "mm" ? "mm" : "inches";

    // Early return if no data
    if (!currentData) {
        return <div>Loading weather data...</div>;
    }

    const {
        apparent_temperature,
        relative_humidity_2m,
        wind_speed_10m,
        rain,
        is_day,
        cloud_cover,
    } = currentData;

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="weather-details-container grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
            <WeatherTodaySecondary
                title={"Feels like"}
                value={`${Math.round(apparent_temperature)}`}
                tempUnit={tempUnit}
            />
            <WeatherTodaySecondary
                title={"Humidity"}
                value={`${Math.round(relative_humidity_2m)}`}
                tempUnit={"%"}
            />

            <div className="bg-secondary rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">Wind</h2>
                <p className="text-foreground text-preset-3">
                    {Math.round(wind_speed_10m)}
                    <abbr
                        className="no-underline"
                        title={
                            windUnit === "km/h"
                                ? "kilometers per hour"
                                : "miles per hour"
                        }
                    >
                        {windUnit}
                    </abbr>
                </p>
            </div>
            <div className="bg-secondary rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">Precipitation</h2>
                <p className="text-foreground text-preset-3">
                    {Math.round(rain)}
                    <abbr
                        className="no-underline"
                        title={
                            precipitationUnit === "mm"
                                ? "millimetres"
                                : "inches"
                        }
                    >
                        {precipitationUnit}
                    </abbr>
                </p>
            </div>
            <div className="bg-secondary rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">Time Period</h2>
                {is_day === 1 ? (
                    <SunIcon
                        className="text-yellow-500 h-8 w-8"
                        aria-label="Day"
                    />
                ) : (
                    <MoonIcon
                        className="text-blue-400 h-8 w-8"
                        aria-label="Night"
                    />
                )}
            </div>
            <div className="bg-secondary rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">
                    Cloud coverage
                </h2>
                <p className="text-foreground text-preset-3">{cloud_cover}%</p>
            </div>
        </div>
    );
}

export default WeatherToday;
