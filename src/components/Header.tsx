import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { type SelectedUnits } from "../types/types";

function Header({
    enabled,
    handleUnitToggle,
    selectedUnits,
    handleSelectUnitCategory,
}: Readonly<{
    enabled: boolean;
    handleUnitToggle: (isImperialEnabled: boolean) => void;
    selectedUnits: { temperature: string; wind: string; precipitation: string };
    handleSelectUnitCategory: (category: keyof SelectedUnits, unit: SelectedUnits[keyof SelectedUnits]) => void;
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

            <div className="text-right">
                <Menu>
                    <MenuButton
                        className="inline-flex items-center gap-2 rounded-md bg-secondary text-primary
                     px-3 py-3 text-preset-8 shadow-inner shadow-white/10 
                     focus:not-data-focus:outline-none data-focus:outline-2 data-focus:outline-white data-focus:-outline-offset-2
                     data-hover:bg-gray-700 data-open:bg-gray-700 
                     transition duration-150 ease-in-out 
                      "
                    >
                        <img src="/assets/images/icon-units.svg" alt="" />
                        <span>Units</span>
                        <ChevronDownIcon className="size-4 fill-white" />
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-53.5 mt-2 origin-top-right rounded-xl border border-gray-700 bg-gray-800 p-1 text-sm
                         text-gray-300 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none
                          data-closed:scale-95 data-closed:opacity-0"
                    >
                        {/* Switch to Imperial/Metric Toggle */}
                        <MenuItem>
                            <button
                                className="group flex w-full text-preset-7 items-center justify-between rounded-lg px-3 py-2 text-foreground font-semibold data-focus:bg-gray-700"
                                onClick={() => handleUnitToggle(!enabled)}
                            >
                                {enabled
                                    ? "Switch to Metric"
                                    : "Switch to Imperial"}
                            </button>
                        </MenuItem>

                        {/* Temperature Section */}
                        <div className="px-3 py-1.5 text-preset-8 text-primary">
                            Temperature
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "temperature",
                                        "celsius"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">Celsius (°C)</span>
                                {selectedUnits.temperature === "celsius" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "temperature",
                                        "fahrenheit"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">Fahrenheit (°F)</span>
                                {selectedUnits.temperature === "fahrenheit" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>

                        {/* Separator */}
                        <div className="my-1 h-px bg-gray-700" />

                        {/* Wind Speed Section */}
                        <div className="px-3 py-1.5 text-preset-8 text-primary">
                            Wind Speed
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelectUnitCategory("wind", "kmh")
                                }
                            >
                                <span className="text-preset-7 text-foreground">km/h</span>
                                {selectedUnits.wind === "kmh" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelectUnitCategory("wind", "mph")
                                }
                            >
                                <span className="text-preset-7 text-foreground">mph</span>
                                {selectedUnits.wind === "mph" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>

                        {/* Separator */}
                        <div className="my-1 h-px bg-gray-700" />

                        {/* Precipitation Section */}
                        <div className="px-3 py-1.5 text-preset-8 text-primary">
                            Precipitation
                        </div>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "precipitation",
                                        "mm"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">Millimeters (mm)</span>
                                {selectedUnits.precipitation === "mm" && (
                                    <CheckIcon className="size-4 fill-white" />
                                )}
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                className="group flex w-full items-center justify-between rounded-lg px-3 py-1.5 data-focus:bg-gray-700"
                                onClick={() =>
                                    handleSelectUnitCategory(
                                        "precipitation",
                                        "inches"
                                    )
                                }
                            >
                                <span className="text-preset-7 text-foreground">Inches (in)</span>
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
