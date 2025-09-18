import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export interface LocationData {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    country_code: string;
    admin1?: string;
}

interface LocationComboboxProps {
    onLocationSelect: (location: LocationData | null) => void;
    onQueryChange: (query: string) => void;
    selectedLocation: LocationData | null;
    locations: LocationData[];
    isLoading: boolean;
    error: Error | null;
}

function LocationCombobox({
    onLocationSelect,
    onQueryChange,
    selectedLocation,
    locations,
    isLoading,
    error,
}: Readonly<LocationComboboxProps>) {
   
    return (
        <div className="relative">
            <Combobox value={selectedLocation} onChange={onLocationSelect}>
                <div className="relative">
                    <ComboboxInput
                        className="w-full py-3 pl-4 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        displayValue={(location: LocationData | null) =>
                            location?.name || ""
                        }
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="Search for a location..."
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        {isLoading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                        ) : (
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                </div>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"                   
                >
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {isLoading  ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                Searching...
                            </div>
                        ) : locations.length === 0  ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                No locations found. Try a different search.
                            </div>
                        ) : error ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-red-600">
                                Error: {error.message}
                            </div>
                        ) : (
                            locations.map((location) => (
                                <ComboboxOption
                                    key={location.id}
                                    value={location}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                                ? "bg-blue-100 text-blue-900"
                                                : "text-gray-900"
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {location.name}
                                                {location.admin1 &&
                                                    `, ${location.admin1}`}
                                                {location.country &&
                                                    `, ${location.country}`}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </Transition>
            </Combobox>
        </div>
    );
}

export default LocationCombobox;
