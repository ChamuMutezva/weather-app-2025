import { getWeatherIcon } from "../utility/getWeatherIcon";
import { type SelectedUnits } from "../types/types";

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
    selectedUnits: SelectedUnits;
};

function SevenDayHourlyForecastDisplay({
    selectedDay,
    dayData,
    selectedUnits,
}: Readonly<SevenDayHourlyForecastDisplayProps>) {
    console.log(dayData);

    const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";
    //const windUnit = selectedUnits.wind === "kmh" ? "km/h" : "mph";
    // const precipitationUnit = selectedUnits.precipitation === "mm" ? "mm" : "inches";

    return (
        <div className="max-h-[38rem] overflow-y-scroll">
            <div className="p-2">
                <h3 className="text-foreground">
                    {new Date(selectedDay).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </h3>
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    className="flex flex-col gap-2 mt-4 scroll-auto"
                >
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
                                {`${Math.round(
                                    dayData.temperature_2m[index]
                                )} ${tempUnit}`}
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
