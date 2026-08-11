import { generateResponse } from "../../ai/ollama.service.js";
import { clientAnalysisInstructions, clientMeetingInstructions } from "./client.instructions.js";
import { validateClientAnalysis, validateClientMeetingSummary } from "./client.validation.js";
import { getClientById, getClientProjects, getClientTasks, saveClientAnalysis, getClientAnalysisByClientId } from "../../tools/client.tools.js";

// Helper to safely parse JSON from AI response, stripping markdown code block formatting
const parseAIResponse = (text) => {
    let cleanText = text.trim();
    if (cleanText.startsWith("```")) {
        const match = cleanText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
        if (match) {
            cleanText = match[1].trim();
        }
    }
    return JSON.parse(cleanText);
};

export const analyzeClient = async (clientId, ownerId = null) => {
    try {
        const client = await getClientById(clientId, ownerId);
        if (!client) {
            throw new Error("Client not found.");
        }

        const projects = await getClientProjects(clientId, ownerId);
        const tasks = await getClientTasks(clientId, ownerId);

        const currentDate = new Date().toISOString().split("T")[0];

        const userPrompt = `
Analyze the following client.

Current Date: ${currentDate}

Client Details:
${JSON.stringify({
    name: client.name,
    email: client.email,
    company: client.company,
    status: client.status,
    contractValue: client.contractValue,
    onBoardingDate: client.onBoardingDate,
    renewalDate: client.renewalDate,
    notes: client.notes,
    activities: client.activities
}, null, 2)}

Projects:
${JSON.stringify(projects.map(p => ({
    name: p.ProjectName,
    description: p.description,
    status: p.status,
    createdAt: p.createdAt,
    expiryDate: p.expiryDate
})), null, 2)}

Tasks:
${JSON.stringify(tasks.map(t => ({
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
    completedAt: t.completedAt
})), null, 2)}

Return ONLY valid JSON structure.
`;

        const responseText = await generateResponse(
            clientAnalysisInstructions,
            userPrompt,
            ownerId
        );

        let analysis;
        try {
            analysis = parseAIResponse(responseText);
        } catch (error) {
            console.error("Failed to parse Client Agent JSON response:", responseText);
            throw new Error("Invalid JSON returned by Client AI Agent.");
        }

        validateClientAnalysis(analysis);

        // Save analysis to separate DB collection
        await saveClientAnalysis(clientId, analysis, ownerId);

        return analysis;

    } catch (error) {
        console.error("Client Agent Analysis Error:", error);
        throw error;
    }
};

export const generateMeetingSummary = async (clientId, ownerId = null) => {
    try {
        const client = await getClientById(clientId, ownerId);
        if (!client) {
            throw new Error("Client not found.");
        }

        const projects = await getClientProjects(clientId, ownerId);
        const tasks = await getClientTasks(clientId, ownerId);

        const currentDate = new Date().toISOString().split("T")[0];

        const userPrompt = `
Generate meeting preparation summary.

Current Date: ${currentDate}

Client Details:
${JSON.stringify({
    name: client.name,
    company: client.company,
    status: client.status,
    notes: client.notes,
    activities: client.activities
}, null, 2)}

Projects:
${JSON.stringify(projects.map(p => ({
    name: p.ProjectName,
    description: p.description,
    status: p.status,
    expiryDate: p.expiryDate
})), null, 2)}

Tasks:
${JSON.stringify(tasks.map(t => ({
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate
})), null, 2)}

Return ONLY valid JSON structure.
`;

        const responseText = await generateResponse(
            clientMeetingInstructions,
            userPrompt,
            ownerId
        );

        let meetingSummary;
        try {
            meetingSummary = parseAIResponse(responseText);
        } catch (error) {
            console.error("Failed to parse Meeting Prep JSON response:", responseText);
            throw new Error("Invalid JSON returned by Client Meeting AI Agent.");
        }

        validateClientMeetingSummary(meetingSummary);

        // Also save this meetingSummary to the client analysis model for persistence
        await saveClientAnalysis(clientId, {
            health: "Healthy", // placeholder, will merge with saved health analysis if it exists
            riskScore: 0,
            risks: [],
            opportunities: [],
            recommendedActions: [],
            summary: "Meeting Prep generated",
            ...meetingSummary, // This will override summary if we want, or keep them separate
            meetingSummary: meetingSummary.summary // Store the meeting prep summary
        }, ownerId);

        // However, we should merge with existing analysis in DB so we don't wipe it out!
        // Let's query first
        const dbAnalysis = await getClientAnalysisByClientId(clientId, ownerId);
        if (dbAnalysis) {
            dbAnalysis.meetingSummary = meetingSummary.summary + "\n\nRecommended Discussion Points:\n" + meetingSummary.recommendedDiscussionPoints.join("\n");
            await dbAnalysis.save();
        }

        return meetingSummary;

    } catch (error) {
        console.error("Client Meeting Summary Error:", error);
        throw error;
    }
};
