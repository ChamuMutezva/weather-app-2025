function LoadingSkeleton() {
    return (
        <div className="content-container grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8 animate-pulse">
            {/* Left Content - Col-span-2 */}
            <div className="left-content col-span-2">
                <div className="weather-info-container flex flex-col gap-6 mb-6 lg:mb-10 lg:gap-10">
                    {/* DisplayLocation Skeleton */}
                    <div className="bg-[url(/assets/images/bg-today-small.svg)] md:bg-[url(/assets/images/bg-today-large.svg)] bg-no-repeat bg-cover rounded-[var(--radius-24)] p-4 min-h-71.5 w-full flex flex-col justify-center items-center md:flex-row md:justify-between gap-4">
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-36"></div>
                        </div>
                        <div className="grid grid-cols-2 place-items-center">
                            <div className="w-30 h-30 bg-gray-300 rounded-full"></div>
                            <div className="h-12 bg-gray-300 rounded w-20"></div>
                        </div>
                    </div>

                    {/* WeatherToday Skeleton */}
                    <div className="weather-details-container grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-secondary-foreground rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4"
                            >
                                <div className="h-6 bg-gray-300 rounded w-20"></div>
                                <div className="h-8 bg-gray-300 rounded w-16"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DailyForecast Skeleton */}
                <div className="daily-forecast-container">
                    <div className="h-7 bg-gray-300 rounded w-32 mb-4"></div>
                    <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 mt-4">
                        {[...Array(7)].map((_, index) => (
                            <li
                                key={index}
                                className="bg-secondary-foreground rounded-[var(--radius-12)] p-2 flex flex-col items-center gap-4"
                            >
                                <div className="h-5 bg-gray-300 rounded w-12"></div>
                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                <div className="flex items-center justify-between w-full gap-2">
                                    <div className="h-6 bg-gray-300 rounded w-8"></div>
                                    <div className="h-6 bg-gray-300 rounded w-8"></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Content - Hourly Forecast */}
            <div className="hourly-forecast-container bg-secondary rounded-[var(--radius-20)] pb-5 px-4 h-[40rem] lg:contain-size lg:h-full overflow-y-scroll">
                {/* SevenDayHourlyForecast Skeleton */}
                <div className="hourly-forecast flex justify-between items-center bg-inherit sticky top-0 w-full py-3">
                    <div className="h-7 bg-gray-300 rounded w-32"></div>
                    <div className="h-8 bg-gray-300 rounded w-32"></div>
                </div>

                {/* SevenDayHourlyForecastDisplay Skeleton */}
                <div className="p-2">
                    <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
                    <ul className="flex flex-col gap-2 mt-4">
                        {[...Array(6)].map((_, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center bg-card rounded-[var(--radius-8)] p-4"
                            >
                                <div className="flex items-center justify-start gap-4">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                    <div className="h-5 bg-gray-300 rounded w-16"></div>
                                </div>
                                <div className="h-5 bg-gray-300 rounded w-12"></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LoadingSkeleton;
