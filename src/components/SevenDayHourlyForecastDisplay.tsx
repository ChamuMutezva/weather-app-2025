type SevenDayHourlyForecastDisplayProps = {
    dayData: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        wind_speed_10m: number[];
        precipitation: number[];
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
                {dayData?.time.map((time, index) => (
                    <div
                        key={time}
                        className="flex justify-between items-center"
                    >
                        <p>
                            {new Date(time).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                        <p>
                            {`${Math.round(dayData.temperature_2m[index])}`}
                            &#176;
                        </p>
                        <p>{`${Math.round(
                            dayData.relative_humidity_2m[index]
                        )}%`}</p>
                        <p>{`${Math.round(
                            dayData.wind_speed_10m[index]
                        )} km/h`}</p>
                        <p>{`${Math.round(
                            dayData.precipitation[index]
                        )} mm`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SevenDayHourlyForecastDisplay;
