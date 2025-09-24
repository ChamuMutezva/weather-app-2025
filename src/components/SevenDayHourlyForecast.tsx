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
    console.log("Selected day:", selectedDay)
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
            });

            if (!seenDays.has(dayStr)) {
                seenDays.add(dayStr);
                days.push(dayStr);
            }
        });
        return days.slice(0, 7); // Return first 7 days
    };

    const days = getUniqueDays();

    //  console.log("Selected day:", weatherData.daily.time[index])

    return (
        <div className="hourly-forecast flex justify-between items-center">
            <div className="hourly-forecast-header">
                <h2 className="text-preset-5 text-foreground">
                    Hourly Forecast
                </h2>
            </div>

            <Menu>
                <MenuButton
                    className="inline-flex items-center gap-2 rounded-md bg-secondary-foreground 
                     px-3 py-1.5 text-preset-7 text-foreground shadow-inner shadow-white/10 
                     focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white
                      data-hover:bg-gray-700 data-open:bg-gray-700"
                >
                    Select Day
                     <ChevronDownIcon className="size-4 fill-white" />
                </MenuButton>
                <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-64 mt-2 origin-top-right rounded-xl border border-gray-700 bg-gray-800 p-1 text-sm
                         text-gray-300 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none
                          data-closed:scale-95 data-closed:opacity-0"
                >
                    {days.map((day, index) => (
                        <MenuItem key={index}>
                            <button
                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-focus:bg-white/10"
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
