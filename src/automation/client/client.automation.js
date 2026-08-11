import { analyzeClient } from "../../agents/client/client.agent.js";
import { shouldCreateTaskForClient } from "./client.rules.js";
import { getClientAnalysisByClientId } from "../../tools/client.tools.js";
import { createTaskForClientRisk } from "../../agents/task/task.agent.js";
import Task from "../../models/task.model.js";

export const analyzeClientsScheduler = async (clients) => {
    console.log(`Starting scheduled client analysis for ${clients.length} clients...`);

    for (const client of clients) {
        try {
            // 1. Run Client Agent analysis (saves to ClientAIAnalysis)
            await analyzeClient(client._id);

            // 2. Fetch the analysis
            const analysis = await getClientAnalysisByClientId(client._id);
            if (!analysis) {
                console.error(`Client analysis not found for client ${client._id}`);
                continue;
            }

            // 3. Evaluate automation rules
            if (shouldCreateTaskForClient(client, analysis)) {
                // Check if a pending AI task already exists for this client
                const existingTask = await Task.findOne({
                    relatedTo: client._id,
                    relatedModel: "Client",
                    status: "Pending",
                    title: /Risk Mitigation|follow up/i
                });

                if (!existingTask) {
                    // Trigger Task Agent to create a mitigation task
                    const task = await createTaskForClientRisk(client._id, {
                        ...analysis.toObject(),
                        assignedTo: client.assignedTo
                    });
                    console.log(`[Client Automation] Created risk mitigation task ${task._id} for client ${client.name}`);
                } else {
                    console.log(`[Client Automation] Pending mitigation task already exists for client ${client.name}`);
                }
            }

        } catch (error) {
            console.error(`[Client Automation] Error analyzing client ${client.name} (${client._id}):`, error.message);
        }
    }
};
