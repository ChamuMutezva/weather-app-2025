import { type LocationData, type SelectedUnits } from "../types/types";
interface DisplayLocationProps {
    selectedLocation: LocationData | null;
    temp: number[];
    selectedUnits: SelectedUnits;
}

function DisplayLocation({
    selectedLocation,
    temp,
    selectedUnits
}: Readonly<DisplayLocationProps>) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    if (!selectedLocation) {
        return null;
    }

     const tempUnit = selectedUnits.temperature === "celsius" ? "°C" : "°F";

    return (
        <div
            className={`weather-info bg-[url(/assets/images/bg-today-small.svg)] 
        md:bg-[url(/assets/images/bg-today-large.svg)] bg-no-repeat bg-cover rounded-[var(--radius-20)]
         p-6 min-h-72 w-full flex flex-col justify-center items-center gap-4`}
        >
            <h2 className="text-preset-4 text-foreground text-center">{`${selectedLocation.name}, ${selectedLocation.country}`}</h2>

            <time
                dateTime={new Date().toISOString()}
                className="text-preset-6 text-foreground opacity-80"
            >
                {formatDate(new Date())}
            </time>
            <div className="grid grid-cols-2 place-items-center">
                <img src="/assets/images/icon-sunny.webp" alt="" />
                <p className="text-preset-1 text-foreground">
                    {`${Math.round(temp[0])}`}
                    <span>{tempUnit}</span>
                </p>
            </div>
        </div>
    );
}

export default DisplayLocation;
