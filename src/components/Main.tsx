import {
    Button,
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Field,
    Label,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    CheckIcon,
    MagnifyingGlassIcon,
    SunIcon,
    CloudIcon,
    ChevronDownIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";

const people = [
    { id: 1, name: "Tom Cook" },
    { id: 2, name: "Wade Cooper" },
    { id: 3, name: "Tanya Fox" },
    { id: 4, name: "Arlene Mccoy" },
    { id: 5, name: "Devon Webb" },
];

function Main() {
    const [query, setQuery] = useState("");
    const [selectedDay, setSelectedDay] = useState("Sunday");
    const [selected, setSelected] = useState<{
        id: number;
        name: string;
    } | null>(people[1]);

    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                  return person.name
                      .toLowerCase()
                      .includes(query.toLowerCase());
              });
    const weatherData = [
        {
            day: "Today",
            icon: (
                <CloudIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            ),
            maxTemp: 26,
            minTemp: 18,
        },
        {
            day: "Tomorrow",
            icon: (
                <SunIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            ),
            maxTemp: 24,
            minTemp: 17,
        },
        {
            day: "Wed",
            icon: (
                <CloudIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            ),
            maxTemp: 22,
            minTemp: 16,
        },
        {
            day: "Thu",
            icon: (
                <CloudIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            ),
            maxTemp: 20,
            minTemp: 15,
        },
        {
            day: "Fri",
            icon: (
                <CloudIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            ),
            maxTemp: 23,
            minTemp: 16,
        },
        {
            day: "Sat",
            icon: (
                <SunIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            ),
            maxTemp: 25,
            minTemp: 18,
        },
        {
            day: "Sun",
            icon: (
                <SunIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
            ),
            maxTemp: 27,
            minTemp: 19,
        },
    ];
    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const onDayChange = (day: string) => {
        setSelectedDay(day);
        // You can add additional logic here to update the forecast based on the selected day
    };

    // Generate data for 24 hours
    const generateHourlyData = () => {
        const now = new Date();
        const hours = [];

        for (let i = 0; i < 24; i++) {
            const hour = new Date(now);
            hour.setHours(now.getHours() + i);

            // Random temperature between 15°C and 30°C
            const temperature = Math.floor(Math.random() * 16) + 15;

            hours.push({
                time: hour.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                }),
                temperature,
                // You can add more properties like weather condition if needed
            });
        }

        return hours;
    };

    const [hourlyData] = useState(generateHourlyData());

    return (
        <main className="pt-10">
            <h1 className="text-preset-2 text-foreground text-center">
                How is the sky looking today
            </h1>
            <div className="main-content flex flex-col gap-8">
                <form className="search-container mx-auto w-full max-w-lg pt-20 flex flex-col gap-3">
                    <Field>
                        <Label className="sr-only">Search for country</Label>
                        <Combobox
                            value={selected}
                            onChange={(value) => setSelected(value)}
                            onClose={() => setQuery("")}
                        >
                            <div className="relative">
                                <ComboboxInput
                                    placeholder="Search for a place..."
                                    className={clsx(
                                        "text-preset-5-m w-full rounded-[var(--radius-12)] border-none bg-white/5 py-3.75 pr-3 pl-8 text-sm/6 text-white",
                                        "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
                                    )}
                                    displayValue={(
                                        person: {
                                            id: number;
                                            name: string;
                                        } | null
                                    ) => person?.name ?? ""}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                />
                                <div className="absolute flex justify-center items-center inset-y-0 left-0 px-2.5">
                                    <MagnifyingGlassIcon className="size-4 fill-white/60" />
                                </div>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    "w-(--input-width) rounded-xl border border-white/5 bg-secondary p-1 [--anchor-gap:--spacing(1)] empty:invisible",
                                    "transition duration-100 ease-in data-leave:data-closed:opacity-0"
                                )}
                            >
                                {filteredPeople.map((person) => (
                                    <ComboboxOption
                                        key={person.id}
                                        value={person}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                    >
                                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                                        <div className="text-sm/6 text-white">
                                            {person.name}
                                        </div>
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                    </Field>
                    <Button
                        className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-12)] bg-primary-foreground 
                        px-3 py-3.5 text-sm/6 text-preset-m-5 text-foreground shadow-inner shadow-white/10 
                    focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white
                     data-hover:bg-gray-600 data-open:bg-gray-700"
                    >
                        Search
                    </Button>
                </form>

                <div className="content-container flex flex-col gap-8">
                    <div className="left-content">
                        <div className="weather-info-container flex flex-col gap-8">
                            <div
                                className="weather-info bg-[url(/assets/images/bg-today-small.svg)] bg-no-repeat
                               bg-cover rounded-[var(--radius-20)] p-8 min-h-72 w-full flex flex-col justify-center items-center gap-4"
                            >
                                <h2 className="text-preset-4 text-foreground">
                                    Berlin , Germany
                                </h2>
                                <p className="text-preset-6 text-foreground/80">
                                    Tuesday, August 2, 2025
                                </p>
                                <div className="grid grid-cols-2">
                                    <img
                                        src="/assets/images/icon-sunny.webp"
                                        alt=""
                                    />
                                    <p className="text-preset-1 text-foreground">
                                        20&#176;
                                    </p>
                                </div>
                            </div>
                            <div className="weather-details-container grid grid-cols-2 gap-4">
                                <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                                    <h2 className="text-foreground">
                                        Feels like
                                    </h2>
                                    <p className="text-foreground">20&#176;</p>
                                </div>
                                <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                                    <h2 className="text-foreground">
                                        humidity
                                    </h2>
                                    <p className="text-foreground">46%</p>
                                </div>
                                <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                                    <h2 className="text-foreground">Wind</h2>
                                    <p className="text-foreground">46km/h</p>
                                </div>
                                <div className="bg-secondary-foreground rounded-[var(--radius-12)] p-4">
                                    <h2 className="text-foreground">
                                        Precipitation
                                    </h2>
                                    <p className="text-foreground">0mm</p>
                                </div>
                            </div>
                        </div>
                        <div className="daily-forecast-container">
                            <h2>Daily forecast</h2>
                            <div className=" grid grid-cols-3 gap-4">
                                {weatherData.map((weather) => {
                                    return (
                                        <div
                                            key={weather.day}
                                            className="bg-secondary-foreground rounded-[var(--radius-12)] p-4"
                                        >
                                            <h3 className="text-foreground">
                                                {weather.day}
                                            </h3>
                                            {weather.icon}
                                            <div>
                                                <p className="text-foreground">
                                                    {weather.minTemp}
                                                </p>
                                                <p className="text-foreground">
                                                    {weather.maxTemp}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="hourly-forecast-container">
                        <div className="hourly-header">
                            <h2>Hourly Forecast</h2>
                            <Menu>
                                <MenuButton
                                    className="inline-flex items-center gap-2 rounded-md bg-secondary text-primary
                   px-3 py-1.5 text-sm/6 font-semibold shadow-inner shadow-white/10 
                   focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white
                    data-hover:bg-gray-700 data-open:bg-gray-700"
                                >
                                    <span>{selectedDay}</span>
                                    <ChevronDownIcon className="size-4 fill-white" />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    anchor="bottom end"
                                    className="w-40 mt-2 origin-top-right rounded-xl border border-gray-700 bg-gray-800 p-1 text-sm
                   text-gray-300 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none
                    data-closed:scale-95 data-closed:opacity-0"
                                >
                                    {dayNames.map((day) => (
                                        <MenuItem key={day}>
                                            <button
                                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                                onClick={() => onDayChange(day)}
                                            >
                                                <span>{day}</span>
                                                {selectedDay === day && (
                                                    <CheckIcon className="size-4 fill-white" />
                                                )}
                                            </button>
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Menu>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                {hourlyData.map((hour, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700/40 rounded-lg flex items-center justify-between p-3 text-center hover:bg-gray-700/60 transition-colors"
                                    >
                                        <div className="flex justify-center mb-2">
                                            <svg
                                                className="w-8 h-8 fill-white"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M19.5 15c-2.5 0-4.2-1.3-4.5-3.2-.3 1.9-2 3.2-4.5 3.2-2.5 0-4.2-1.3-4.5-3.2-.3 1.9-2 3.2-4.5 3.2v2c3.2 0 5-2.2 5-5 0-2.8 1.8-5 5-5s5 2.2 5 5c0 2.8 1.8 5 5 5v-2z" />
                                                <path d="M19.5 15c-1.9 0-3.2-1.2-3.2-3.2 0-1.9 1.2-3.2 3.2-3.2v2c-.7 0-1.2.5-1.2 1.2 0 .7.5 1.2 1.2 1.2v2z" />
                                            </svg>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {hour.time}
                                        </div>
                                        <div className="text-lg font-bold mt-1">
                                            {hour.temperature}°
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Main;
