import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

function Header() {
    const [enabled, setEnabled] = useState(false);
    const [selectedUnits, setSelectedUnits] = useState({
        temperature: "celsius",
        wind: "kmh",
        precipitation: "mm",
    });

    const handleSelect = (category: string, unit: string) => {
        console.log("Category", category);
        console.log("unit", unit);
        setSelectedUnits((prev) => ({
            ...prev,
            [category]: unit,
        }));
    };
    const handleUnitToggle = (isImperialEnabled: boolean) => {
        setEnabled(isImperialEnabled);
        if (isImperialEnabled) {
            setSelectedUnits({
                temperature: "fahrenheit",
                wind: "mph",
                precipitation: "inches",
            });
        } else {
            setSelectedUnits({
                temperature: "celsius",
                wind: "kmh",
                precipitation: "mm",
            });
        }
    };
    return (
        <header className="flex justify-between items-center ">
            <a href="/" aria-label="home page">
                <img src="/assets/images/logo.svg" alt="" />
            </a>

            <div className="text-right">
                <Menu>
                    <MenuButton
                        className="inline-flex items-center gap-2 rounded-md bg-secondary text-primary
                     px-3 py-1.5 text-sm/6 font-semibold shadow-inner shadow-white/10 
                     focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white
                      data-hover:bg-gray-700 data-open:bg-gray-700"
                    >
                        <img src="/assets/images/icon-units.svg" alt="" />
                        <span>Units</span>
                        <ChevronDownIcon className="size-4 fill-white" />
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-64 mt-2 origin-top-right rounded-xl border border-gray-700 bg-gray-800 p-1 text-sm
                         text-gray-300 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none
                          data-closed:scale-95 data-closed:opacity-0"
                    >
                        {/* Switch to Imperial/Metric Toggle */}
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-blue-400 font-semibold data-focus:bg-gray-700"
                                onClick={() => handleUnitToggle(!enabled)}
                            >
                                {enabled
                                    ? "Switch to Metric"
                                    : "Switch to Imperial"}
                            </button>
                        </MenuItem>

                        {/* Temperature Section */}
                        <div className="px-3 py-1.5 text-xs text-gray-400">
                            Temperature
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelect("temperature", "celsius")
                                }
                            >
                                <span>Celsius (°C)</span>
                                {selectedUnits.temperature === "celsius" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelect("temperature", "fahrenheit")
                                }
                            >
                                <span>Fahrenheit (°F)</span>
                                {selectedUnits.temperature === "fahrenheit" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>

                        {/* Separator */}
                        <div className="my-1 h-px bg-gray-700" />

                        {/* Wind Speed Section */}
                        <div className="px-3 py-1.5 text-xs text-gray-400">
                            Wind Speed
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() => handleSelect("wind", "kmh")}
                            >
                                <span>km/h</span>
                                {selectedUnits.wind === "kmh" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() => handleSelect("wind", "mph")}
                            >
                                <span>mph</span>
                                {selectedUnits.wind === "mph" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>

                        {/* Separator */}
                        <div className="my-1 h-px bg-gray-700" />

                        {/* Precipitation Section */}
                        <div className="px-3 py-1.5 text-xs text-gray-400">
                            Precipitation
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelect("precipitation", "mm")
                                }
                            >
                                <span>Millimeters (mm)</span>
                                {selectedUnits.precipitation === "mm" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelect("precipitation", "inches")
                                }
                            >
                                <span>Inches (in)</span>
                                {selectedUnits.precipitation === "inches" && (
                                    <CheckIcon className="size-4 fill-white" />
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
