// Helper function to check if coordinates are similar (within 0.01 degrees variation)
// The default threshold of 0.01 degrees is approximately:
// Latitude: ~1.1 km (0.01° × 111 km/degree)
// Longitude: ~0.9 km at the equator (varies with latitude)
// So this function considers coordinates "similar" if they're within about 1 kilometer of each other.

export const areCoordsSimilar = (
    coords1: { latitude: number; longitude: number },
    coords2: { latitude: number; longitude: number },
    threshold: number = 0.01
): boolean => {
    return (
        Math.abs(coords1.latitude - coords2.latitude) <= threshold &&
        Math.abs(coords1.longitude - coords2.longitude) <= threshold
    );
};