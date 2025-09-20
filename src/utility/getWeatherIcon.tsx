export function getWeatherIcon(code: number) {
    if (code === 0) return <img src="/assets/images/icon-sunny.webp" alt="" />; // Clear sky
    if (code >= 1 && code <= 3)
        return (
            <img
                src="/assets/images/icon-overcast.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Mainly clear to overcast
    if (code === 45 || code === 48)
        return (
            <img
                src="/assets/images/icon-fog.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Fog
    if (code >= 51 && code <= 55)
        return (
            <img
                src="/assets/images/icon-drizzle.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Drizzle
    if (code >= 61 && code <= 65)
        return (
            <img
                src="/assets/images/icon-rain.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Rain
    if (code >= 80 && code <= 82)
        return (
            <img
                src="/assets/images/icon-partly-cloudy.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Rain showers
    if (code >= 71 && code <= 75)
        return (
            <img
                src="/assets/images/icon-snow.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Snow fall
    if (code === 85 || code === 86)
        return (
            <img
                src="/assets/images/icon-snow.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Snow showers
    if (code === 95)
        return (
            <img
                src="/assets/images/icon-storm.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Thunderstorm
    if (code === 96 || code === 99)
        return (
            <img
                src="/assets/images/icon-storm.webp"
                width={60}
                height={60}
                alt=""
            />
        ); // Thunderstorm with hail
    return "❓"; // Unknown code
}
