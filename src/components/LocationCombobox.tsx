import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Field,
    Label,
    Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { type LocationData } from "../types/types";

interface LocationComboboxProps {
    onLocationSelect: (location: LocationData | null) => void;
    onQueryChange: (query: string) => void;
    selectedLocation: LocationData | null;
    locations: LocationData[];
    isLoading: boolean;
    isPendingCoords: boolean;
    error: Error | null;
}

const renderLocationOption = (location: LocationData) => (
    <ComboboxOption
        key={location.id}
        value={location}
        className={({ active }) =>
            `relative cursor-default select-none py-2 pl-10 pr-4 m-2 rounded-[var(--radius-8)] ${
                active ? "bg-card text-white" : "text-white"
            }`
        }
    >
        {({ selected }) => (
            <>
                <span
                    className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                    }`}
                >
                    {location.name}
                    {location.admin1 && `, ${location.admin1}`}
                    {location.country && `, ${location.country}`}
                </span>
                {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                )}
            </>
        )}
    </ComboboxOption>
);

const LoadingMessage = () => (
    <div className="relative cursor-default select-none px-4 py-2 text-white">
        Searching...
    </div>
);

const ErrorMessage = ({ error }: { error: Error }) => (
    <div className="relative cursor-default select-none px-4 py-2 text-red-600">
        Error: {error.message}
    </div>
);

const EmptyMessage = () => (
    <div className="relative cursor-default select-none px-4 py-2 text-white">
        No locations found. Try a different search.
    </div>
);

const renderOptions = (
    isLoading: boolean,
    error: Error | null,
    locations: LocationData[]
) => {
    if (isLoading) return <LoadingMessage />;
    if (error) return <ErrorMessage error={error} />;
    if (locations.length === 0) return <EmptyMessage />;
    return locations.map(renderLocationOption);
};

function LocationCombobox({
    onLocationSelect,
    onQueryChange,
    selectedLocation,
    locations,
    isLoading,
    error,
    isPendingCoords,
}: Readonly<LocationComboboxProps>) {
    return (
        <div className="relative w-full max-w-xl place-self-center">
            <Field>
                <Label className="sr-only">Search for country</Label>
                <Combobox value={selectedLocation} onChange={onLocationSelect}>
                    <div className="relative">
                        <ComboboxInput
                            className={clsx(
                                "text-preset-5-m w-full rounded-[var(--radius-12)] border-none bg-secondary py-3.75 pr-3 pl-10 text-sm/6 text-white",
                                "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
                            )}
                            displayValue={(location: LocationData | null) =>
                                location?.name || ""
                            }
                            onChange={(event) =>
                                onQueryChange(event.target.value)
                            }
                            placeholder="Search for a location..."
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                            {isLoading && isPendingCoords ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                            ) : (
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </div>
                    </div>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-secondary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {renderOptions(isLoading, error, locations)}
                        </ComboboxOptions>
                    </Transition>
                </Combobox>
            </Field>
        </div>
    );
}

export default LocationCombobox;
