import { Moon, Sun } from "lucide-react";
import { type SelectedUnits } from "../types/types";
import WeatherTodaySecondary from "./WeatherTodaySecondary";

type WeatherTodayProps = {
    hourlyTemperature: number;
    hourlyHumidity: number;
    hourlyWindSpeed: number;
    hourlyPrecipitation: number;
    selectedUnits: SelectedUnits;
    period: number;
    cloudCover: number;
};

function WeatherToday({
    hourlyTemperature,
    hourlyHumidity,
    hourlyWindSpeed,
    hourlyPrecipitation,
    selectedUnits,
    period,
    cloudCover,
}: Readonly<WeatherTodayProps>) {
    const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";
    const windUnit = selectedUnits.wind === "kmh" ? "km/h" : "mph";
    const precipitationUnit =
        selectedUnits.precipitation === "mm" ? "mm" : "inches";
    console.log(cloudCover);

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="weather-details-container grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
            <WeatherTodaySecondary
                title={"Feels like"}
                value={`${Math.round(hourlyTemperature)}`}
                tempUnit={tempUnit}
            />
            <WeatherTodaySecondary
                title={"Humidity"}
                value={`${Math.round(hourlyHumidity)}`}
                tempUnit={"%"}
            />

            <div className="bg-secondary rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">Wind</h2>
                <p className="text-foreground text-preset-3">
                    {Math.round(hourlyWindSpeed)}
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
                    {Math.round(hourlyPrecipitation)}
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
                {period === 1 ? (
                    <Sun
                        className="text-yellow-500"
                        size={48}
                        aria-label="Day"
                    />
                ) : (
                    <Moon
                        className="text-blue-400"
                        size={48}
                        aria-label="Night"
                    />
                )}
            </div>
            <div className="bg-secondary rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">
                    Cloud coverage
                </h2>
                <p className="text-foreground text-preset-3">{cloudCover}%</p>
            </div>
        </div>
    );
}

export default WeatherToday;
