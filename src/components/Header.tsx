import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
    CheckIcon,
    ChevronDownIcon,
    SunIcon,
    MoonIcon,
    Cog6ToothIcon,
} from "@heroicons/react/16/solid";
import { type SelectedUnits } from "../types/types";

function Header({
    enabled,
    handleUnitToggle,
    selectedUnits,
    handleSelectUnitCategory,
    isDarkMode, // New prop for current theme state
    toggleDarkMode, // New function to toggle theme
}: Readonly<{
    enabled: boolean;
    handleUnitToggle: (isImperialEnabled: boolean) => void;
    selectedUnits: { temperature: string; wind: string; precipitation: string };
    handleSelectUnitCategory: (
        category: keyof SelectedUnits,
        unit: SelectedUnits[keyof SelectedUnits]
    ) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}>) {
    return (
        <header className="flex justify-between items-center ">
            <a href="/" aria-label="home page">
                <img
                    src="/assets/images/logo.svg"
                    alt=""
                    className="h-8 w-auto"
                />
            </a>

            <div className="text-right ">
                <Menu>
                    <MenuButton
                        className="inline-flex items-center gap-2 rounded-md bg-secondary text-foreground
                     px-3 py-3 text-preset-7 shadow-inner shadow-white/10 focus:not-data-focus:outline-none 
                     data-focus:outline-2 data-focus:outline-white data-focus:-outline-offset-2
                     data-hover:bg-popover data-open:bg-popover transition duration-150 ease-in-out 
                      "
                    >
                        {/* <img src="/assets/images/icon-units.svg" alt="" /> */}
                        <Cog6ToothIcon className="size-5 fill-foreground" />
                        <span>Settings</span>
                        <ChevronDownIcon className="size-4 fill-foreground" />
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-60 mt-2 origin-top-right rounded-xl border border-card bg-secondary p-1 text-sm
                         text-gray-300 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none
                          data-closed:scale-95 data-closed:opacity-0 z-10"
                    >
                        {/* ========================================= */}
                        {/* 1. DARK MODE TOGGLE (New Feature)         */}
                        {/* ========================================= */}
                        <div className="px-3 pt-1.5 pb-0.5 text-preset-8 text-secondary-foreground font-bold">
                            Theme
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full text-preset-7 items-center justify-between rounded-lg px-3 py-2 text-foreground font-semibold data-focus:bg-popover"
                                onClick={toggleDarkMode}
                            >
                                <span className="flex items-center gap-2">
                                    {isDarkMode ? (
                                        <MoonIcon className="size-5 fill-foreground" />
                                    ) : (
                                        <SunIcon className="size-5 fill-foreground" />
                                    )}
                                    {isDarkMode
                                        ? "Switch to Light Mode"
                                        : "Switch to Dark Mode"}
                                </span>
                            </button>
                        </MenuItem>

                        {/* Separator */}
                        <div className="my-2 h-px bg-border" />

                        {/* ========================================= */}
                        {/* 2. UNITS SECTION                          */}
                        {/* ========================================= */}
                        <div className="px-3 pt-1.5 pb-0.5 text-preset-6 text-secondary-foreground font-bold">
                            Units
                        </div>
                        <div className="my-2 h-px bg-border" />

                        {/* Switch to Imperial/Metric Toggle */}
                        <MenuItem>
                            <button
                                className="group flex w-full text-preset-7 items-center justify-between rounded-lg px-3 py-2 text-foreground font-semibold data-focus:bg-popover"
                                onClick={() => handleUnitToggle(!enabled)}
                            >
                                {enabled
                                    ? "Switch to Metric"
                                    : "Switch to Imperial"}
                            </button>
                        </MenuItem>

                        {/* Temperature Section */}
                        <div className="px-3 py-1.5 text-preset-8 text-secondary-foreground ">
                            Temperature
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "temperature",
                                        "celsius"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">
                                    Celsius (°C)
                                </span>
                                {selectedUnits.temperature === "celsius" && (
                                    <CheckIcon className="size-4 fill-foreground" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "temperature",
                                        "fahrenheit"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">
                                    Fahrenheit (°F)
                                </span>
                                {selectedUnits.temperature === "fahrenheit" && (
                                    <CheckIcon className="size-4 fill-foreground" />
                                )}
                            </button>
                        </MenuItem>

                        {/* Separator */}
                        <div className="my-1 h-px bg-border" />

                        {/* Wind Speed Section */}
                        <div className="px-3 py-1.5 text-preset-8 text-secondary-foreground">
                            Wind Speed
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover"
                                onClick={() =>
                                    handleSelectUnitCategory("wind", "kmh")
                                }
                            >
                                <span className="text-preset-7 text-foreground">
                                    km/h
                                </span>
                                {selectedUnits.wind === "kmh" && (
                                    <CheckIcon className="size-4 fill-foreground" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover"
                                onClick={() =>
                                    handleSelectUnitCategory("wind", "mph")
                                }
                            >
                                <span className="text-preset-7 text-foreground">
                                    mph
                                </span>
                                {selectedUnits.wind === "mph" && (
                                    <CheckIcon className="size-4 fill-foreground" />
                                )}
                            </button>
                        </MenuItem>

                        {/* Separator */}
                        <div className="my-1 h-px bg-border" />

                        {/* Precipitation Section */}
                        <div className="px-3 py-1.5 text-preset-8 text-secondary-foreground ">
                            Precipitation
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "precipitation",
                                        "mm"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">
                                    Millimeters (mm)
                                </span>
                                {selectedUnits.precipitation === "mm" && (
                                    <CheckIcon className="size-4 fill-foreground" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "precipitation",
                                        "inches"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">
                                    Inches (in)
                                </span>
                                {selectedUnits.precipitation === "inches" && (
                                    <CheckIcon className="size-4 fill-foreground" />
                                )}
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
        </header>
    );
}

export default Header;
