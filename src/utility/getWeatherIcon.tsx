export function getWeatherIcon(code: number) {
    if (code === 0)
        return (
            <img
                src="/assets/images/icon-sunny.webp"
                alt=""
                width={60}
                height={60}
                className="theme-aware-image"
            />
        ); // Clear sky
    if (code >= 1 && code <= 3)
        return (
            <img
                src="/assets/images/icon-overcast.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Mainly clear to overcast
    if (code === 45 || code === 48)
        return (
            <img
                src="/assets/images/icon-fog.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Fog
    if (code >= 51 && code <= 55)
        return (
            <img
                src="/assets/images/icon-drizzle.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Drizzle
    if (code >= 61 && code <= 65)
        return (
            <img
                src="/assets/images/icon-rain.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Rain
    if (code >= 80 && code <= 82)
        return (
            <img
                src="/assets/images/icon-partly-cloudy.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Rain showers
    if (code >= 71 && code <= 75)
        return (
            <img
                src="/assets/images/icon-snow.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Snow fall
    if (code === 85 || code === 86)
        return (
            <img
                src="/assets/images/icon-snow.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Snow showers
    if (code === 95)
        return (
            <img
                src="/assets/images/icon-storm.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Thunderstorm
    if (code === 96 || code === 99)
        return (
            <img
                src="/assets/images/icon-storm.webp"
                width={60}
                height={60}
                alt=""
                className="theme-aware-image"
            />
        ); // Thunderstorm with hail
    return "❓"; // Unknown code
}
