type WeatherTodayProps = {
    hourlyTemperature: number[];
    hourlyHumidity: number[];
    hourlyWindSpeed: number[];
    hourlyPrecipitation: number[];
};

function WeatherToday({
    hourlyTemperature,
    hourlyHumidity,
    hourlyWindSpeed,
    hourlyPrecipitation,
}: Readonly<WeatherTodayProps>) {
    return (
        <div className="weather-details-container grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                <h2 className="text-foreground">Feels like</h2>
                <p className="text-foreground">
                    {`${Math.round(hourlyTemperature[0])}`}
                    <span>&#176;</span>
                </p>
            </div>
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                <h2 className="text-foreground">Humidity</h2>
                <p className="text-foreground">
                    {`${Math.round(hourlyHumidity[0])}%`}
                </p>
            </div>
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                <h2 className="text-foreground">Wind</h2>
                <p className="text-foreground">
                    {`${Math.round(hourlyWindSpeed[0])} km/h`}
                </p>
            </div>
            <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                <h2 className="text-foreground">Precipitation</h2>
                <p className="text-foreground">
                    {`${Math.round(hourlyPrecipitation[0])} mm`}
                </p>
            </div>
        </div>
    );
}

export default WeatherToday;
