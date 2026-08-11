import { generateResponse } from "../../ai/ollama.service.js";
import { getLeadById, getLeadAnalysisByLeadId } from "../../tools/lead.tools.js";
import taskInstructions, {
    taskAnalysisInstructions,
    taskPrioritizationInstructions,
    dailyTaskSummaryInstructions
} from "./task.instructions.js";
import {
    validateTaskCreation,
    validateTaskAnalysis,
    validateTaskPrioritization,
    validateDailyTaskSummary
} from "./task.validation.js";
import {
    createTaskForLeadTool,
    getClientForTask,
    getProjectForTask,
    saveTaskAnalysis,
    createTaskForClientTool
} from "../../tools/task.tools.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";
import Task from "../../models/task.model.js";

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

// Helper to resolve assignedTo to a valid ObjectId
const resolveAssignedTo = async (assignedToInput) => {
    if (assignedToInput && mongoose.Types.ObjectId.isValid(assignedToInput)) {
        return assignedToInput;
    }
    if (typeof assignedToInput === "string" && assignedToInput.trim() !== "") {
        const foundUser = await User.findOne({
            $or: [
                { name: assignedToInput },
                { email: assignedToInput }
            ]
        });
        if (foundUser) return foundUser._id;
    }
    const defaultUser = await User.findOne({ isActive: true });
    if (defaultUser) return defaultUser._id;
    return new mongoose.Types.ObjectId();
};

export const createTaskForLead = async (LeadId, ownerId = null) => {
    try {
        const lead = await getLeadById(LeadId, ownerId);
        if (!lead) {
            throw new Error("Lead not found or unauthorized.");
        }
        const analysis = await getLeadAnalysisByLeadId(LeadId, ownerId);
        if (!analysis) {
            throw new Error("Lead analysis not found or unauthorized.");
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
            userPrompt,
            ownerId
        );

        let taskData;
        try {
            taskData = parseAIResponse(response);
        } catch (error) {
            throw new Error("Invalid JSON returned by AI.");
        }

        validateTaskCreation(taskData);

        await createTaskForLeadTool(LeadId, taskData, ownerId);
        return taskData;

    } catch (error) {
        console.error("Error creating task for lead:", error);
        throw error;
    }
};

export const analyzeTask = async (taskId, ownerId = null) => {
    try {
        const task = await Task.findOne({ _id: taskId, ownerId });
        if (!task) {
            throw new Error("Task not found or unauthorized.");
        }

        const client = await getClientForTask(task, ownerId);
        const project = await getProjectForTask(task, ownerId);

        const currentDate = new Date().toISOString().split("T")[0];

        const userPrompt = `
Analyze the operational priority and risks of the following task.

Current Date: ${currentDate}

Task Details:
${JSON.stringify({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt
}, null, 2)}

Context:
- Related Model: ${task.relatedModel}
- Associated Client: ${client ? JSON.stringify({ name: client.name, status: client.status, renewalDate: client.renewalDate }) : "None"}
- Associated Project: ${project ? JSON.stringify({ name: project.ProjectName, status: project.status, expiryDate: project.expiryDate }) : "None"}

Return ONLY valid JSON.
`;

        const response = await generateResponse(
            taskAnalysisInstructions,
            userPrompt,
            ownerId
        );

        let analysis;
        try {
            analysis = parseAIResponse(response);
        } catch (error) {
            console.error("Failed to parse task analysis JSON response:", response);
            throw new Error("Invalid JSON returned by Task AI Agent.");
        }

        validateTaskAnalysis(analysis);

        await saveTaskAnalysis(taskId, analysis, ownerId);

        return analysis;

    } catch (error) {
        console.error("Task Agent Analysis Error:", error);
        throw error;
    }
};

export const prioritizeTasks = async (tasks, ownerId = null) => {
    try {
        const currentDate = new Date().toISOString().split("T")[0];

        // Fetch client context for each task
        const tasksWithContext = [];
        for (const t of tasks) {
            const client = await getClientForTask(t, ownerId);
            const project = await getProjectForTask(t, ownerId);
            tasksWithContext.push({
                taskId: t._id,
                title: t.title,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate,
                client: client ? { name: client.name, status: client.status, renewalDate: client.renewalDate } : null,
                project: project ? { name: project.ProjectName, status: project.status } : null
            });
        }

        const userPrompt = `
Prioritize the following list of pending CRM tasks. Recommend the priority level (Low, Medium, High, Critical) and supply reasons.

Current Date: ${currentDate}

Task List:
${JSON.stringify(tasksWithContext, null, 2)}

Return ONLY valid JSON.
`;

        const response = await generateResponse(
            taskPrioritizationInstructions,
            userPrompt,
            ownerId
        );

        let prioritization;
        try {
            prioritization = parseAIResponse(response);
        } catch (error) {
            console.error("Failed to parse task prioritization JSON response:", response);
            throw new Error("Invalid JSON returned by Task Prioritization Agent.");
        }

        validateTaskPrioritization(prioritization);

        // Update task priorities in database based on recommendations
        for (const item of prioritization.prioritizedTasks) {
            await Task.findOneAndUpdate(
                { _id: item.taskId, ownerId },
                { priority: item.priority },
                { returnDocument: "after" }
            );
            await saveTaskAnalysis(item.taskId, {
                priority: item.priority,
                reason: item.reason,
                recommendedAction: "AI prioritized during bulk analysis"
            }, ownerId);
        }

        return prioritization;

    } catch (error) {
        console.error("Task Agent Prioritization Error:", error);
        throw error;
    }
};

export const generateDailyTaskSummary = async (tasks, ownerId = null) => {
    try {
        const currentDate = new Date().toISOString().split("T")[0];

        // Compute metrics
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === "Pending").length;
        const inProgress = tasks.filter(t => t.status === "In Progress").length;
        const completed = tasks.filter(t => t.status === "Completed").length;
        
        const overdue = tasks.filter(t => t.status !== "Completed" && new Date(t.dueDate) < new Date()).length;
        
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const dueToday = tasks.filter(t => new Date(t.dueDate) >= startOfToday && new Date(t.dueDate) <= endOfToday).length;

        const tasksData = tasks.map(t => ({
            title: t.title,
            status: t.status,
            priority: t.priority,
            dueDate: t.dueDate
        }));

        const userPrompt = `
Analyze the operational task load of the team.

Current Date: ${currentDate}

Metrics:
- Total Tasks: ${total}
- Pending: ${pending}
- In Progress: ${inProgress}
- Completed: ${completed}
- Overdue: ${overdue}
- Due Today: ${dueToday}

Task Details:
${JSON.stringify(tasksData, null, 2)}

Return ONLY valid JSON.
`;

        const response = await generateResponse(
            dailyTaskSummaryInstructions,
            userPrompt,
            ownerId
        );

        let summary;
        try {
            summary = parseAIResponse(response);
        } catch (error) {
            console.error("Failed to parse daily task summary JSON response:", response);
            throw new Error("Invalid JSON returned by Daily Task Summary Agent.");
        }

        validateDailyTaskSummary(summary);

        return summary;

    } catch (error) {
        console.error("Daily Task Summary Agent Error:", error);
        throw error;
    }
};

export const createTaskForClientRisk = async (clientId, clientAnalysis, ownerId = null) => {
    try {
        const resolvedAssignedTo = await resolveAssignedTo(clientAnalysis.assignedTo);

        // Determine priority based on health / riskScore
        let priority = "Medium";
        if (clientAnalysis.health === "Critical") {
            priority = "Critical";
        } else if (clientAnalysis.health === "At Risk" || clientAnalysis.riskScore > 50) {
            priority = "High";
        }

        const taskData = {
            title: `Risk Mitigation: Follow up with at-risk client`,
            description: `AI Client Health Analysis triggered: \nSummary: ${clientAnalysis.summary} \nRisks identified: ${clientAnalysis.risks.join(", ")} \nRecommended Action: ${clientAnalysis.recommendedActions.join(", ")}`,
            priority: priority,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
            assignedTo: resolvedAssignedTo,
            status: "Pending"
        };

        const task = await createTaskForClientTool(clientId, taskData, ownerId);

        return task;

    } catch (error) {
        console.error("Error creating risk task for client:", error);
        throw error;
    }
};