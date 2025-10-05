import { getWeatherIcon } from "../utility/getWeatherIcon";
import { type SelectedUnits } from "../types/types";
interface DailyForecastProps {
    weatherData: {
        daily: {
            weather_code: number[];
            time: string[];
            temperature_2m_max: number[];
            temperature_2m_min: number[];
        };
    };
    selectedUnits: SelectedUnits;
}

function DailyForecast({
    weatherData,
    selectedUnits,
}: Readonly<DailyForecastProps>) {
    const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";

    return (
        <div className="daily-forecast-container">
            <h2 className="text-preset-5 text-foreground">Daily forecast</h2>
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 mt-4">
                {weatherData?.daily.time.map((date, index) => {
                    return (
                        <li
                            key={date}
                            className="bg-secondary rounded-[var(--radius-12)] p-2 flex flex-col items-center gap-4"
                        >
                            <p className="text-foreground text-preset-6">
                                {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                })}
                            </p>

                            {getWeatherIcon(
                                weatherData.daily.weather_code[index]
                            )}
                            <div
                                aria-live="polite"
                                aria-atomic="true"
                                className="flex items-center justify-between w-full gap-2"
                            >
                                <p className="text-foreground text-preset-7">
                                    <span className="sr-only">
                                        Maximum temperature
                                    </span>
                                    {`${Math.round(
                                        weatherData.daily.temperature_2m_max[
                                            index
                                        ]
                                    )}`}
                                    <span>{tempUnit}</span>
                                </p>
                                <p className="text-accent opacity-80 text-preset-7">
                                    <span className="sr-only">
                                        Minimum temperature
                                    </span>
                                    {`${Math.round(
                                        weatherData.daily.temperature_2m_min[
                                            index
                                        ]
                                    )}`}
                                    <span>{tempUnit}</span>
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default DailyForecast;
