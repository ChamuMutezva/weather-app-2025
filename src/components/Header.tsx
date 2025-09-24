import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";

function Header({
    enabled,
    handleUnitToggle,
    selectedUnits,
    handleSelectUnitCategory,
}: Readonly<{
    enabled: boolean;
    handleUnitToggle: (isImperialEnabled: boolean) => void;
    selectedUnits: { temperature: string; wind: string; precipitation: string };
    handleSelectUnitCategory: (category: string, unit: string) => void;
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
                     px-3 py-1.5 text-preset-8 shadow-inner shadow-white/10 
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
                                    handleSelectUnitCategory(
                                        "temperature",
                                        "celsius"
                                    )
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
                                    handleSelectUnitCategory(
                                        "temperature",
                                        "fahrenheit"
                                    )
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
                                onClick={() =>
                                    handleSelectUnitCategory("wind", "kmh")
                                }
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
                                onClick={() =>
                                    handleSelectUnitCategory("wind", "mph")
                                }
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
                                    handleSelectUnitCategory(
                                        "precipitation",
                                        "mm"
                                    )
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
                                    handleSelectUnitCategory(
                                        "precipitation",
                                        "inches"
                                    )
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
