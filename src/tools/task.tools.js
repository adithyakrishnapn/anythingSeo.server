import Task from "../models/task.model.js";
import Lead from "../models/lead.model.js";
import LeadAIAnalysis from "../models/LeadAIAnalysis.js";
import Client from "../models/client.model.js";
import ProjectModel from "../models/project.model.js";
import TaskAIAnalysis from "../models/TaskAIAnalysis.js";

export const createTaskForLeadTool = async (leadId, taskData = {}, ownerId) => {
    // Check if the lead exists and belongs to the owner
    const lead = await Lead.findOne({ _id: leadId, ownerId });

    if (!lead) {
        throw new Error("Lead not found or unauthorized");
    }

    // Get the latest AI analysis for this lead
    const analysis = await LeadAIAnalysis
        .findOne({ leadId, ownerId })
        .sort({ generatedAt: -1 });

    const task = await Task.create({
        ownerId,
        title:
            taskData.title ??
            `Follow up with ${lead.name}`,

        description:
            taskData.description ??
            analysis?.recommendedAction ??
            "Contact the lead.",

        relatedTo: leadId,
        relatedModel: "Lead",

        assignedTo:
            taskData.assignedTo ??
            lead.assignedTo,

        priority:
            taskData.priority ??
            analysis?.priority ??
            "Medium",

        dueDate:
            taskData.dueDate ??
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days

        status: taskData.status ?? "Pending",

        createdBy: taskData.createdBy,
    });

    return task;
};

export const getTaskByLeadId = async (leadId, ownerId) => {
    return await Task.findOne({ relatedTo: leadId, relatedModel: "Lead", ownerId }).sort({ createdAt: -1 });
};

export const changeStatusByLeadId = async (leadId, ownerId) => {
    return await Task.findOneAndUpdate(
        {
            relatedTo: leadId,
            relatedModel: "Lead",
            ownerId
        },
        {
            status: "Cancelled"
        },
        {
            returnDocument: "after"
        }
    );
};

export const getClientForTask = async (task, ownerId) => {
    if (task.relatedModel === "Client") {
        return await Client.findOne({ _id: task.relatedTo, ownerId });
    } else if (task.relatedModel === "Project") {
        const project = await ProjectModel.findOne({ _id: task.relatedTo, ownerId });
        if (project && project.clientId) {
            return await Client.findOne({ _id: project.clientId, ownerId });
        }
    } else if (task.relatedModel === "Lead") {
        return await Lead.findOne({ _id: task.relatedTo, ownerId });
    }
    return null;
};

export const getProjectForTask = async (task, ownerId) => {
    if (task.relatedModel === "Project") {
        return await ProjectModel.findOne({ _id: task.relatedTo, ownerId });
    }
    return null;
};

export const getUserTasks = async (userId, ownerId) => {
    return await Task.find({ assignedTo: userId, ownerId }).sort({ createdAt: -1 });
};

export const saveTaskAnalysis = async (taskId, analysis, ownerId) => {
    return await TaskAIAnalysis.findOneAndUpdate(
        { taskId, ownerId },
        {
            ownerId,
            priority: analysis.priority,
            reason: analysis.reason,
            recommendedAction: analysis.recommendedAction,
            generatedAt: new Date()
        },
        {
            returnDocument: "after",
            upsert: true
        }
    );
};

export const getTaskAnalysisByTaskId = async (taskId, ownerId) => {
    return await TaskAIAnalysis.findOne({ taskId, ownerId }).sort({ generatedAt: -1 });
};

export const createTaskForClientTool = async (clientId, taskData = {}, ownerId) => {
    const client = await Client.findOne({ _id: clientId, ownerId });
    if (!client) {
        throw new Error("Client not found or unauthorized");
    }

    const task = await Task.create({
        ownerId,
        title: taskData.title ?? `Task for ${client.name}`,
        description: taskData.description ?? "Follow up with client",
        relatedTo: clientId,
        relatedModel: "Client",
        assignedTo: taskData.assignedTo,
        priority: taskData.priority ?? "Medium",
        dueDate: taskData.dueDate ?? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: taskData.status ?? "Pending",
        createdBy: taskData.createdBy,
        aiGenerated: true
    });

    return task;
};