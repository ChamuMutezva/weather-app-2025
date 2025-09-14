import {
    Button,
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Field,
    Label,
} from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
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
    return (
        <main>
            <h1>How is the sky looking today</h1>
            <div className="main-content">
                <div className="search-container mx-auto w-52 pt-20">
                    <Field>
                        <Label className="sr-only">Search for country</Label>
                        <Combobox
                            value={selected}
                            onChange={(value) => setSelected(value)}
                            onClose={() => setQuery("")}
                        >
                            <div className="relative">
                                <ComboboxInput
                                    className={clsx(
                                        "w-full rounded-lg border-none bg-white/5 py-1.5 pr-3 pl-8 text-sm/6 text-white",
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
                                <ComboboxButton className="group absolute inset-y-0 left-0 px-2.5">
                                    <MagnifyingGlassIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    "w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible",
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
                    <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700">
                        Search
                    </Button>
                </div>

                <div className="content-container">
                    <div className="left-content">
                        <div className="weather-info-container">
                          <div className="weather-info bg-[url(/assets/images/bg-today-small.svg)] bg-no-repeat rounded-[var(--radius-20)] p-8">
                             <h2>Berlin , Germany</h2>
                             <p>Tuesday, August 2, 2025</p>
                             <p>20 deg</p>
                          </div>
                          <div className="weather-details-container"></div>
                        </div>
                        <div className="daily-forecast-container"></div>
                    </div>
                    <div className="hourly-forecast-container"></div>
                </div>
            </div>
        </main>
    );
}

export default Main;
