import { generateResponse } from "../../ai/ollama.service.js";
import { getLeadById, getLeadAnalysisByLeadId } from "../../tools/lead.tools.js";
import taskInstructions from "./task.instructions.js";
import { validateTaskCreation } from "./task.validation.js";
import { createTaskForLeadTool } from "../../tools/task.tools.js";

export const createTaskForLead = async (LeadId)=>{
    try{
        const lead = await getLeadById(LeadId);
        if(!lead){
            throw new Error("Lead not found.");
        }
        const analysis = await getLeadAnalysisByLeadId(LeadId);
        if (!analysis) {
            throw new Error("Lead analysis not found.");
        }

        const userPrompt = `
        Create a task for the following lead based on the analysis provided.

        Lead Details:
        ${JSON.stringify(lead, null, 2)}

        Lead Analysis:
        ${JSON.stringify(analysis, null, 2)}

        Return ONLY valid JSON with the following fields
        `;

        const response = await generateResponse(
            taskInstructions,
            userPrompt
        );

        let taskData;

        try {
            taskData = JSON.parse(response);
        } catch (error) {
            throw new Error("Invalid JSON returned by AI.");
        }

        validateTaskCreation(taskData);


        await createTaskForLeadTool(LeadId, taskData);
        return taskData;


    } catch (error) {
        console.error("Error creating task for lead:", error);
        throw error;
    }
}