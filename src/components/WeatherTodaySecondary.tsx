type WeatherTodaySecondaryProps = {   
   title: string;
   value: string;
   tempUnit: string;
};
function WeatherTodaySecondary({ title, value, tempUnit }: Readonly<WeatherTodaySecondaryProps>) {
    return (
        <div className="bg-secondary rounded-[var(--radius-12)] min-h-30 p-4 flex flex-col justify-baseline items-center gap-4">
            <h2 className="text-foreground text-preset-6">{title}</h2>
            <p className="text-foreground text-preset-3">
                {value}
                <span>{tempUnit}</span>
            </p>
        </div>
    );
}

export default WeatherTodaySecondary;
