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

function DailyForecast({ weatherData, selectedUnits }: Readonly<DailyForecastProps>) {
    const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";

    return (
        <div className="daily-forecast-container">
            <h2>Daily forecast</h2>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-4">
                {weatherData?.daily.time.map((date, index) => {
                    return (
                        <div
                            key={date}
                            className="bg-secondary-foreground rounded-[var(--radius-12)] p-4 flex flex-col items-center"
                        >
                            <p className="text-foreground">
                                {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                })}
                            </p>
                          
                            {getWeatherIcon(
                                weatherData.daily.weather_code[index]
                            )}
                            <div className="flex items-center justify-between w-full">
                                <p className="text-foreground">
                                    {`${Math.round(
                                        weatherData.daily.temperature_2m_max[
                                            index
                                        ]
                                    )}`}
                                    <span>{tempUnit}</span>
                                </p>
                                <p className="text-foreground opacity-80">
                                    {`${Math.round(
                                        weatherData.daily.temperature_2m_min[
                                            index
                                        ]
                                    )}`}
                                    <span>{tempUnit}</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DailyForecast;
