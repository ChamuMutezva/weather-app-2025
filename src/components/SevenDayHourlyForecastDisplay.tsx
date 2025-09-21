import { getWeatherIcon } from "../utility/getWeatherIcon";
type SevenDayHourlyForecastDisplayProps = {
    dayData: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        precipitation: number[];
        weather_code: number[];
    } | null;
    selectedDay: string;
};

function SevenDayHourlyForecastDisplay({
    selectedDay,
    dayData,
}: Readonly<SevenDayHourlyForecastDisplayProps>) {
    console.log(dayData);

    return (
        <div>
            <div className="p-2">
                <h2 className="text-foreground">
                    Hourly data for {selectedDay}
                </h2>
                <div className="flex flex-col gap-2">
                    {dayData?.time.map((time, index) => (
                        <div
                            key={time}
                            className="flex justify-between items-center bg-card rounded-[var(--radius-8)] "
                        >
                            <div className="flex items-center justify-start gap-4">
                                {getWeatherIcon(dayData.weather_code[index])}
                                <p className="text-foreground text-preset-5-m p-4">
                                    {new Date(time).toLocaleTimeString(
                                        "en-US",
                                        {
                                            hour: "2-digit",
                                            // minute: "2-digit",
                                        }
                                    )}
                                </p>
                            </div>

                            <p className="text-foreground text-preset-7 p-4">
                                {`${Math.round(dayData.temperature_2m[index])}`}
                                &#176;
                            </p>
                            {/*
                            <p>{`${Math.round(
                                dayData.relative_humidity_2m[index]
                            )}%`}</p>
                            <p>{`${Math.round(
                                dayData.wind_speed_10m[index]
                            )} km/h`}</p>
                            <p>{`${Math.round(
                                dayData.precipitation[index]
                            )} mm`}</p>
                             */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SevenDayHourlyForecastDisplay;
