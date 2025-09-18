import { type LocationData } from "./LocationComboBox";

interface DisplayLocationProps {
    selectedLocation: LocationData | null;
}

function DisplayLocation({ selectedLocation }: Readonly<DisplayLocationProps>) {
    if (!selectedLocation) {
        return null;
    }
    return (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800">
                Selected Location
            </h2>
            <div className="mt-2">
                <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedLocation.name}
                </p>
                <p>
                    <span className="font-medium">Country:</span>{" "}
                    {selectedLocation.country}
                </p>
                <p>
                    <span className="font-medium">Latitude:</span>{" "}
                    {selectedLocation.latitude}
                </p>
                <p>
                    <span className="font-medium">Longitude:</span>{" "}
                    {selectedLocation.longitude}
                </p>
                {selectedLocation.admin1 && (
                    <p>
                        <span className="font-medium">Region:</span>{" "}
                        {selectedLocation.admin1}
                    </p>
                )}
            </div>
        </div>
    );
}

export default DisplayLocation;
