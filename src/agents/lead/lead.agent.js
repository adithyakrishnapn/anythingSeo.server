// src/agents/lead/lead.agent.js

import leadInstructions from "./lead.instructions.js";

import { generateResponse } from "../../ai/ollama.service.js";
import {
    getLeadById,
    getLeadActivities,
    saveLeadAnalysis
} from "../../tools/lead.tools.js";
import { validateLeadAnalysis } from "./lead.validation.js";



export const analyzeLead = async (leadId, ownerId = null) => {
    try {

        // 1. Fetch Lead
        const lead = await getLeadById(leadId, ownerId);

        if (!lead) {
            throw new Error("Lead not found.");
        }

        // 2. Fetch Activities / Notes
        const { activities, notes } = await getLeadActivities(leadId, ownerId);

        // 3. Build User Prompt
        const userPrompt = `
Analyze the following lead.

Lead Details:
${JSON.stringify(lead, null, 2)}

Activities:
${JSON.stringify(activities, null, 2)}

Notes:
${JSON.stringify(notes, null, 2)}

Return ONLY valid JSON.
`;

        // 4. Generate AI Response
        const response = await generateResponse(
            leadInstructions,
            userPrompt,
            ownerId
        );

        // 5. Parse Response
        let analysis;

        try {
            analysis = JSON.parse(response);
        } catch (error) {
            throw new Error("Invalid JSON returned by AI.");
        }

        // 6. Validate Required Fields
        validateLeadAnalysis(analysis);

        // 7. Save / Update Analysis
        await saveLeadAnalysis(
            leadId,
            analysis,
            ownerId
        );

        // 8. Return Analysis
        return analysis;

    } catch (error) {

        console.error("Lead Agent Error:", error);

        throw error;

    }
};