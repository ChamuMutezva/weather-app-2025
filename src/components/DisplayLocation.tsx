import { type LocationData } from "./LocationCombobox";

interface DisplayLocationProps {
    selectedLocation: LocationData | null;
}

function DisplayLocation({ selectedLocation }: Readonly<DisplayLocationProps>) {
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
    return (
        <div
            className={`weather-info bg-[url(/assets/images/bg-today-small.svg)] 
        md:bg-[url(/assets/images/bg-today-large.svg)] bg-no-repeat bg-cover rounded-[var(--radius-20)]
         p-8 min-h-72 w-full flex flex-col justify-center items-center gap-4`}
        >
            <h2 className="text-preset-4 text-foreground">{`${selectedLocation.name}, ${selectedLocation.country}`}</h2>
            <p className="text-preset-6 text-foreground/80">
                {formatDate(new Date())}
            </p>
            <div className="grid grid-cols-2">
                <img src="/assets/images/icon-sunny.webp" alt="" />
                <p className="text-preset-1 text-foreground">20&#176;</p>
            </div>
        </div>
    );
}

export default DisplayLocation;
