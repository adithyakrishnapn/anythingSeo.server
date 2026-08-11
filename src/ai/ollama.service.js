import Groq from "groq-sdk";
import env from "../config/env.js";
import UserSettings from "../models/UserSettings.js";
import { decrypt } from "../utils/encryption.js";

/**
 * Generate a response using the Groq SDK
 * Scoped to ownerId if provided, so it uses the user's custom key or falls back.
 */
export const generateResponse = async (systemPrompt, userPrompt, ownerId = null) => {
    try {
        let apiKey = env.GROK_API_KEY;

        if (ownerId) {
            const settings = await UserSettings.findOne({ ownerId });
            if (settings?.ai?.groqApiKey) {
                try {
                    const decryptedKey = decrypt(settings.ai.groqApiKey);
                    if (decryptedKey && decryptedKey.trim() !== '') {
                        apiKey = decryptedKey;
                    }
                } catch (decErr) {
                    console.error("Failed to decrypt custom Groq API key, falling back to default:", decErr);
                }
            }
        }

        const groqInstance = new Groq({ apiKey });
        const response = await groqInstance.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ]
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error generating response from LLM:", error);
        throw error;
    }
};