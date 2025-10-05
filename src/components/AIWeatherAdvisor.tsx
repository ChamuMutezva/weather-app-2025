import { useState } from 'react';
import { getGeminiAdvice } from '../api/geminiService';
import { type WeatherData, type SelectedUnits, type LocationData } from '../types/types'; 
import { Sparkles } from 'lucide-react'; 

interface AIWeatherAdvisorProps {
    weatherData: WeatherData | null;
    selectedUnits: SelectedUnits;
    selectedLocation?: LocationData; // Optional, in case you want to display location context
}

/**
 * Component to handle user input and display AI-generated weather advice.
 * It connects to the secure backend proxy.
 */
function AIWeatherAdvisor({ weatherData, selectedUnits, selectedLocation }: Readonly<AIWeatherAdvisorProps>) {
    const [adviceQuery, setAdviceQuery] = useState("Suggest an indoor activity and a comfortable outfit.");
    const [adviceResponse, setAdviceResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to structure the weather data for the AI prompt
    const getCurrentWeatherContext = (data: WeatherData | null, units: SelectedUnits): string => {
        if (!data || !selectedLocation) {
            return "Current weather data is unavailable.";
        }
        
        // Extracting current data and applying units for the prompt
        const current = data.hourly; 
        const tempUnit = units.temperature === 'celsius' ? '°C' : '°F';
        const windUnit = units.wind === 'kmh' ? 'km/h' : 'mph';
        const precipUnit = units.precipitation === 'mm' ? 'mm' : 'in';

        // NOTE: In a production app, ensure all values use the `convertedWeatherData` values 
        // to correctly reflect the selected units. This is a text representation for the AI.

        return `
            Location:  ${selectedLocation?.name ?? "Unknown"}, ${selectedLocation?.country ?? ""}
            Current Time: ${new Date().toLocaleTimeString()}
            Temperature: ${current.temperature_2m}${tempUnit} 
            Condition: ${current.weather_code}
            Wind Speed: ${current.wind_speed_10m}${windUnit}
            Precipitation: ${current.precipitation}${precipUnit}
            Humidity: ${data.hourly.relative_humidity_2m}%
        `;
    };

    const fetchWeatherAdvice = async () => {
        if (isLoading || !weatherData) return;
        setIsLoading(true);
        setError(null);
        setAdviceResponse("");

        const weatherContext = getCurrentWeatherContext(weatherData, selectedUnits);

        const userPrompt = `
            Analyze the following weather data and provide thoughtful, practical advice and suggestions based on the user's request. 
            Keep your response professional, friendly, and helpful.

            --- CURRENT WEATHER DATA ---
            ${weatherContext}
            --- USER REQUEST ---
            ${adviceQuery}
        `;

        const systemInstruction = "You are a helpful and creative Weather Activity Advisor. Your goal is to give personalized, safe, and fun activity suggestions based on current weather conditions and the user's query.";

        const payload = {
            userPrompt: userPrompt,
            systemInstruction: systemInstruction,
        };

        try {
            const text = await getGeminiAdvice(payload);
            setAdviceResponse(text);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred while contacting the advisor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card p-6 rounded-[var(--radius-20)] shadow-xl border border-border">
            <h2 className="text-preset-5 font-bold mb-4 flex items-center gap-2 text-primary">
                <Sparkles className="size-6 text-accent" /> AI Weather Advisor
            </h2>
            
            <div className="space-y-4">
                <label htmlFor="advice-query" className="block text-sm font-medium text-foreground/70">
                    Ask the AI Advisor for personalized suggestions:
                </label>
                <textarea
                    id="advice-query"
                    rows={2}
                    value={adviceQuery}
                    onChange={(e) => setAdviceQuery(e.target.value)}
                    className="w-full p-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-foreground placeholder-foreground/50 resize-none"
                    placeholder="E.g., What should I wear today? Is it safe for a bike ride?"
                    disabled={isLoading}
                ></textarea>
                
                <button
                    onClick={fetchWeatherAdvice}
                    disabled={isLoading || !weatherData}
                    className="w-full px-4 py-3 bg-primary hover:bg-primary-foreground/80 text-white font-bold rounded-lg transition duration-150 shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                        <Sparkles className="size-5 mr-2" />
                    )}
                    {isLoading ? 'Generating Advice...' : 'Get Personalized Advice'}
                </button>

                {error && (
                    <div className="p-3 bg-red-800/20 border border-red-500 rounded-lg text-red-300 font-medium text-sm">
                        Error: {error}
                    </div>
                )}
                {adviceResponse && (
                    <div className="p-4 bg-background rounded-xl shadow-inner border border-border">
                        <h3 className="text-preset-6 font-semibold mb-2 text-primary">Advisor Response:</h3>
                        <p className="whitespace-pre-wrap text-foreground/90 text-sm">{adviceResponse}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AIWeatherAdvisor;
