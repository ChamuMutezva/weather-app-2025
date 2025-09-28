 /**
 * api/advice.ts
 * This is the Vercel Serverless Function handler, now fully typed.
 * It secures the Gemini API Key using environment variables.
 */
import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node'; 

// --- Custom Types for Request/Response ---

// Define the structure of the data expected from the React frontend
interface RequestBody {
    userPrompt: string;
    systemInstruction: string;
}

// --- Serverless Handler Logic ---

// The environment variable name (must be set in Vercel project settings)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// Initialize the AI client
if (!GEMINI_API_KEY) {
    // In a production environment, throwing an error here is safer than continuing
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}
// Initialize the AI client outside the handler for better performance (hot reloading)
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = 'gemini-2.5-flash-preview-05-20';


// Use Vercel's types for the handler function
export default async function handler(
    req: VercelRequest, 
    res: VercelResponse // Use the typed response interface
) {
    // 1. Ensure it's a POST request
    if (req.method !== 'POST') {
        // Respond immediately for security and efficiency
        return res.status(405).json({ error: 'Method Not Allowed. Must be POST.' });
    }

    try {
        // 2. Safely cast the request body to the expected interface
        const { userPrompt, systemInstruction } = req.body as RequestBody;

        // Type checking: ensure userPrompt is a valid string
        if (typeof userPrompt !== 'string' || userPrompt.trim() === '') {
            return res.status(400).json({ error: "Missing or invalid 'userPrompt' in request body." });
        }

        // 3. Call the Gemini API
        const result = await ai.models.generateContent({
            model: model,
            contents: [{ parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: {
                    parts: [{ text: systemInstruction || "You are a helpful assistant." }] // Use a fallback system instruction
                }
            }
        });
        
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || 
                             "Failed to generate advice.";

        // 4. Send the successful response back to the React client
        // TypeScript now validates that the response matches ResponseData (text is required here)
        res.status(200).json({ text: generatedText });
    
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Ensure the error response also matches ResponseData (error message is required here)
        res.status(500).json({ 
            error: 'An internal error occurred during AI advice generation.' 
        });
    }
}
