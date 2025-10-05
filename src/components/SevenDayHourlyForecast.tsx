import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface DailyForecastProps {
    weatherData: {
        daily: {
            weather_code: number[];
            time: string[];
            temperature_2m_max: number[];
            temperature_2m_min: number[];
        };
        hourly: {
            time: string[];
            temperature_2m: number[];
            relative_humidity_2m: number[];
            wind_speed_10m: number[];
            precipitation: number[];
        };
    };
    onDaySelect: (day: string) => void;
    selectedDay: string;
}

function SevenDayHourlyForecast({
    weatherData,
    onDaySelect,
    selectedDay,
}: Readonly<DailyForecastProps>) {
    console.log(weatherData.hourly);
    console.log("Selected day:", new Date(selectedDay).toDateString());
    const getUniqueDays = () => {
        const days: string[] = [];
        const seenDays = new Set();

        weatherData.hourly.time.forEach((timeStr) => {
            const date = new Date(timeStr);

            // Format the date to get a string representing the day (e.g., "2023-10-01")
            const dayStr = date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
            });

            if (!seenDays.has(dayStr)) {
                seenDays.add(dayStr);
                days.push(dayStr);
            }
        });
        return days.slice(0, 7); // Return first 7 days
    };

    const days = getUniqueDays();

    return (
        <div className="hourly-forecast flex justify-between items-center bg-inherit sticky top-0 w-full py-3">
            <div className="hourly-forecast-header">
                <h2 className="text-preset-5 text-foreground">
                    Hourly Forecast
                </h2>
            </div>

            <Menu>
                <MenuButton
                    className="inline-flex items-center gap-2 rounded-md bg-popover
                     px-3 py-1.5 text-preset-7 text-foreground shadow-inner shadow-white/10 
                     focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white
                      data-hover:bg-popover data-open:bg-popover"
                >
                    {new Date(selectedDay).toLocaleDateString("en-US", {
                        weekday: "long",
                    }) || "Select Day"}
                    <ChevronDownIcon className="size-4 fill-foreground" />
                </MenuButton>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-64 mt-2 origin-top-right rounded-xl border border-border bg-secondary p-1 text-sm
                         text-gray-300 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none
                          data-closed:scale-95 data-closed:opacity-0"
                >
                    {days.map((day, index) => (
                        <MenuItem key={index}>
                            <button
                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-focus:bg-popover text-secondary-foreground"
                                onClick={() => {
                                    // Get the actual date string from daily data
                                    const selectedDate =
                                        weatherData.daily.time[index];
                                    onDaySelect(selectedDate);
                                }}
                            >
                                {day}
                            </button>
                        </MenuItem>
                    ))}
                </MenuItems>
            </Menu>
        </div>
    );
}

export default SevenDayHourlyForecast;
