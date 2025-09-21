import { getWeatherIcon } from "../utility/getWeatherIcon";

interface DailyForecastProps {
    weatherData: {
        daily: {
            weather_code: number[];
            time: string[];
            temperature_2m_max: number[];
            temperature_2m_min: number[];
        };
    };
}

function DailyForecast({ weatherData }: Readonly<DailyForecastProps>) {
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
                            {/*<img src="/assets/images/icon-sunny.webp" alt="" /> */}
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
                                    <span>&#176;</span>
                                </p>
                                <p className="text-foreground opacity-80">
                                    {`${Math.round(
                                        weatherData.daily.temperature_2m_min[
                                            index
                                        ]
                                    )}`}
                                    <span>&#176;</span>
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
