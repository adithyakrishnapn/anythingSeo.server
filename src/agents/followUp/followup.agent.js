import { generateResponse } from "../../ai/ollama.service.js";

import followupInstructions from "./followUp.instructions.js";

import validateFollowUpAnalysis from "./followup.validation.js";

export const generateFollowUpAnalysis = async (lead, analysis) => {
    const userPrompt = `
        Lead Details

        ${JSON.stringify(lead, null, 2)}

        Lead Analysis

        ${JSON.stringify(analysis, null, 2)}

        Generate a personalized follow-up email.
    `;

    const response = await generateResponse(
        followupInstructions,
        userPrompt
    );

    const email = JSON.parse(response);

    validateFollowUpAnalysis(email);

    return email;

}