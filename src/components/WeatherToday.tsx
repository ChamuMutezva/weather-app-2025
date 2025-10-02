import { type SelectedUnits } from "../types/types";

type WeatherTodayProps = {   
    hourlyTemperature: number;
    hourlyHumidity: number;
    hourlyWindSpeed: number;
    hourlyPrecipitation: number;
    time: string;
    selectedUnits: SelectedUnits;
};

function WeatherToday({
    hourlyTemperature,
    hourlyHumidity,
    hourlyWindSpeed,
    hourlyPrecipitation,
    time,
    selectedUnits,
}: Readonly<WeatherTodayProps>) {
    const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";
    const windUnit = selectedUnits.wind === "kmh" ? "km/h" : "mph";
    const precipitationUnit =
        selectedUnits.precipitation === "mm" ? "mm" : "inches";

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="weather-details-container grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">Feels like</h2>
                <p className="text-foreground text-preset-3">
                    {`${Math.round(hourlyTemperature)}`}
                    <span>{tempUnit}</span>
                </p>
            </div>
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">Humidity</h2>
                <p className="text-foreground text-preset-3">
                    {`${Math.round(hourlyHumidity)}%`}
                </p>
            </div>
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
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
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
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
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
                <h2 className="text-foreground text-preset-6">
                    Updated <span>{time.split("T")[0]}</span>
                </h2>
                <p className="text-foreground text-preset-3">
                    <span>{time.split("T")[1]}</span>
                </p>
            </div>            
        </div>
    );
}

export default WeatherToday;
