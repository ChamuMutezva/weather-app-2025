/** 
 * * Client-side service for communicating with the secure Node.js backend proxy.
 * This ensures the Gemini API key remains hidden on the server.
 */

// WARNING: This URL must match the port and endpoint of your running Node.js server
const PROXY_API_URL = "http://localhost:3000/api/advice"; 

interface AdvicePayload {
    userPrompt: string;
    systemInstruction: string;
}

/**
 * Fetches personalized weather advice from the backend proxy which calls the Gemini API.
 * * @param payload - The data to send to the server, including the constructed prompt and system instructions.
 * @returns The generated text advice.
 * @throws Error if the network request fails or the server returns an error status.
 */
export async function getGeminiAdvice(payload: AdvicePayload): Promise<string> {
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(PROXY_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // If the server responded, but with an error status (4xx or 5xx)
                const errorBody = await response.json();
                throw new Error(errorBody.error || `Proxy server returned status ${response.status}`);
            }

            // The response body now contains the { text: string } from the proxy server
            const result = await response.json();
            
            if (result.text) {
                return result.text; // Success
            } else {
                throw new Error("Received an empty or malformed response from the advice service.");
            }

        } catch (e) {
            console.error(`Attempt ${attempt + 1} failed:`, e);
            if (attempt === maxRetries - 1) {
                // Throw the final error after the last attempt fails
                throw new Error(`Failed to get AI advice after ${maxRetries} retries. Check if the Node.js server is running on ${PROXY_API_URL}.`);
            } else {
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }
    // Should be unreachable
    throw new Error("Internal error during advice fetching.");
}
