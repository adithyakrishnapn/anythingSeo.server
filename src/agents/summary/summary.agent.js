import { generateResponse } from "../../ai/ollama.service.js";
import summaryInstructions from "./summary.instructions.js";
import {
    validateSummaryOutput,
    validateSummaryStatistics
} from "./summary.validation.js";

export const generateDailySummary = async (statistics) => {

    validateSummaryStatistics(statistics);

    const userPrompt = `
Generate today's CRM manager summary using the following statistics.

${JSON.stringify(statistics, null, 2)}
`;

    const response = await generateResponse(
        summaryInstructions,
        userPrompt
    );

    const parsedResponse = JSON.parse(response);

    validateSummaryOutput(parsedResponse);

    return parsedResponse;
};