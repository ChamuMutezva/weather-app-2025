import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
    CheckIcon,
    ChevronDownIcon,
    SunIcon,
    MoonIcon,
    Cog6ToothIcon,
} from "@heroicons/react/16/solid";
import { type SelectedUnits } from "../types/types";
import { useTheme } from "../hooks/useTheme";

function Header({
    enabled,
    handleUnitToggle,
    selectedUnits,
    handleSelectUnitCategory,
}: Readonly<{
    enabled: boolean;
    handleUnitToggle: (isImperialEnabled: boolean) => void;
    selectedUnits: { temperature: string; wind: string; precipitation: string };
    handleSelectUnitCategory: (
        category: keyof SelectedUnits,
        unit: SelectedUnits[keyof SelectedUnits]
    ) => void;
}>) {
    const { isDarkMode, toggleDarkMode } = useTheme();

     // Helper function to render units (using JSX safe symbols)
    const renderUnitText = (unit: 'celsius' | 'fahrenheit') => {
        if (unit === 'celsius') {
            // Using the degree symbol Unicode entity to avoid LaTeX parsing errors in this context
            return `Celsius (°C)`;
        }
        if (unit === 'fahrenheit') {
            return `Fahrenheit (°F)`;
        }
        return '';
    };

    return (
        <header className="flex justify-between items-center ">
            <a href="/" aria-label="home page">
                <img
                    src="/assets/images/logo.svg"
                    alt=""
                    className="h-8 w-auto dark:invert-0 invert saturate-10 dark:saturate-100 brightness-75"
                />
            </a>

            <div className="text-right ">
                <Menu>
                    <MenuButton
                        className="inline-flex items-center gap-2 rounded-md bg-secondary text-foreground
                     px-3 py-3 text-preset-7 shadow-inner shadow-white/10 focus:not-data-focus:outline-none 
                     data-focus:outline-2 data-focus:outline-white data-focus:-outline-offset-2
                     data-hover:bg-popover data-open:bg-popover transition motion-reduce:transition-none 
                     duration-150 motion-reduce:duration-0 ease-in-out motion-reduce:ease-linear"
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
                         text-gray-300 transition duration-300 ease-out [--anchor-gap:--spacing(1)] focus:outline-none
                          data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 motion-reduce:data-enter:duration-0
                           data-leave:duration-200 motion-reduce:data-leave:duration-0 z-10"
                    >
                        {/* ========================================= */}
                        {/* 1. DARK MODE TOGGLE                       */}
                        {/* ========================================= */}
                        <div className="mb-2">
                            <div className="px-3 pt-1.5 pb-0.5 text-preset-8 text-secondary-foreground font-bold flex items-center gap-2">
                                <div className="p-1 rounded bg-primary/20">
                                    {isDarkMode ? (
                                        <MoonIcon className="size-3.5 fill-foreground" />
                                    ) : (
                                        <SunIcon className="size-3.5 fill-foreground" />
                                    )}
                                </div>
                                Theme
                            </div>
                            <div className="mx-3 mb-2 h-px bg-border/60" />
                            <MenuItem>
                                <button
                                    type="button"
                                    className="group flex w-full text-preset-7 items-center justify-between rounded-lg px-3 py-2 text-foreground
                                     font-semibold data-focus:bg-popover data-focus:ring-2 data-focus:ring-primary/50 transition-all motion-reduce:transition-none duration-200"
                                    onClick={toggleDarkMode}
                                    aria-label={
                                        isDarkMode
                                            ? "Switch to light mode"
                                            : "Switch to dark mode"
                                    }
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
                        </div>

                        {/* ========================================= */}
                        {/* 2. UNITS SECTION                          */}
                        {/* ========================================= */}
                        <div className="mt-3 mb-1">
                            <div className="px-3 pt-1.5 pb-0.5 text-preset-6 text-secondary-foreground font-bold flex items-center gap-2">
                                <div className="p-1 rounded bg-primary/20">
                                    <Cog6ToothIcon className="size-3.5 fill-foreground" />
                                </div>
                                Units
                            </div>
                            <div className="mx-3 mb-2 h-px bg-border/60" />

                            {/* Switch to Imperial/Metric Toggle */}
                            <MenuItem>
                                <button
                                    type="button"
                                    className="group flex w-full text-preset-7 items-center justify-between rounded-lg px-3 py-2 
                                    text-foreground font-semibold data-focus:bg-popover data-focus:ring-2 data-focus:ring-primary/50 
                                    transition-all motion-reduce:transition-none duration-200 motion-reduce:duration-0 mb-2"
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
                                    type="button"
                                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover
                                          data-focus:ring-2 data-focus:ring-primary/50 transition-all motion-reduce:transition-none 
                                          duration-200 motion-reduce:duration-0
                                    ${
                                        selectedUnits.temperature === "celsius"
                                            ? "bg-background ring-1 ring-primary/30"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSelectUnitCategory(
                                            "temperature",
                                            "celsius"
                                        )
                                    }
                                >
                                    <span className="text-preset-7 text-foreground">
                                        {renderUnitText("celsius")}
                                    </span>
                                    {selectedUnits.temperature ===
                                        "celsius" && (
                                        <CheckIcon className="size-4 fill-foreground" />
                                    )}
                                </button>
                            </MenuItem>
                            <MenuItem>
                                <button
                                    type="button"
                                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover
                                         data-focus:ring-2 data-focus:ring-primary/50 transition-all motion-reduce:transition-none duration-200 motion-reduce:duration-0
                                    ${
                                        selectedUnits.temperature ===
                                        "fahrenheit"
                                            ? "bg-background ring-1 ring-primary/30"
                                            : ""
                                    } `}
                                    onClick={() =>
                                        handleSelectUnitCategory(
                                            "temperature",
                                            "fahrenheit"
                                        )
                                    }
                                >
                                    <span className="text-preset-7 text-foreground">
                                        {renderUnitText("fahrenheit")}
                                    </span>
                                    {selectedUnits.temperature ===
                                        "fahrenheit" && (
                                        <CheckIcon className="size-4 fill-foreground" />
                                    )}
                                </button>
                            </MenuItem>

                            {/* Separator */}
                            <div className="my-1 h-px bg-border/40" />

                            {/* Wind Speed Section */}
                            <div className="px-3 py-1.5 text-preset-8 text-secondary-foreground">
                                Wind Speed
                            </div>
                            <MenuItem>
                                <button
                                    type="button"
                                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover  data-focus:ring-2 
                                        data-focus:ring-primary/50 transition-all motion-reduce:transition-none duration-200 motion-reduce:duration-0
                                     ${
                                         selectedUnits.wind === "kmh"
                                             ? "bg-background ring-1 ring-primary/30"
                                             : ""
                                     }`}
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
                                    type="button"
                                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover 
                                        data-focus:ring-2 data-focus:ring-primary/50 transition-all motion-reduce:transition-none
                                         duration-200 motion-reduce:duration-0
                                     ${
                                         selectedUnits.wind === "mph"
                                             ? "bg-background ring-1 ring-primary/30"
                                             : ""
                                     }`}
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
                            <div className="my-1 h-px bg-border/40" />

                            {/* Precipitation Section */}
                            <div className="px-3 py-1.5 text-preset-8 text-secondary-foreground ">
                                Precipitation
                            </div>
                            <MenuItem>
                                <button
                                    type="button"
                                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-popover 
                                        data-focus:ring-2 data-focus:ring-primary/50 transition-all motion-reduce:transition-none 
                                        duration-200 motion-reduce:duration-0
                                     ${
                                         selectedUnits.precipitation === "mm"
                                             ? "bg-background ring-1 ring-primary/30"
                                             : ""
                                     }`}
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
                                    type="button"
                                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-1.5 
                                        data-focus:bg-popover data-focus:ring-2 data-focus:ring-primary/50
                                         transition-all motion-reduce:transition-none duration-200 motion-reduce:duration-0
                                     ${
                                         selectedUnits.precipitation ===
                                         "inches"
                                             ? "bg-background ring-1 ring-primary/30"
                                             : ""
                                     }`}
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
                                    {selectedUnits.precipitation ===
                                        "inches" && (
                                        <CheckIcon className="size-4 fill-foreground" />
                                    )}
                                </button>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>
            </div>
        </header>
    );
}

export default Header;
