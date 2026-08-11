import Client from "../models/client.model.js";
import ProjectModel from "../models/project.model.js";
import Task from "../models/task.model.js";
import ClientAIAnalysis from "../models/ClientAIAnalysis.js";

export const getClientById = async (clientId, ownerId) => {
    return await Client.findOne({ _id: clientId, ownerId });
};

export const getAllClients = async (ownerId) => {
    return await Client.find({ ownerId });
};

export const getClientProjects = async (clientId, ownerId) => {
    return await ProjectModel.find({ clientId, ownerId }).sort({ createdAt: -1 });
};

export const getClientTasks = async (clientId, ownerId) => {
    // Get all tasks directly related to the client
    const directTasks = await Task.find({
        relatedTo: clientId,
        relatedModel: "Client",
        ownerId
    }).sort({ createdAt: -1 });

    // Get all projects for this client
    const projects = await ProjectModel.find({ clientId, ownerId });
    const projectIds = projects.map(p => p._id);

    // Get all tasks related to those projects
    const projectTasks = await Task.find({
        relatedTo: { $in: projectIds },
        relatedModel: "Project",
        ownerId
    }).sort({ createdAt: -1 });

    // Return combined tasks
    return [...directTasks, ...projectTasks];
};

export const saveClientAnalysis = async (clientId, analysis, ownerId) => {
    const savedAnalysis = await ClientAIAnalysis.findOneAndUpdate(
        { clientId, ownerId },
        {
            ownerId,
            health: analysis.health,
            riskScore: analysis.riskScore,
            risks: analysis.risks,
            opportunities: analysis.opportunities,
            recommendedActions: analysis.recommendedActions,
            summary: analysis.summary,
            meetingSummary: analysis.meetingSummary,
            generatedAt: new Date()
        },
        {
            returnDocument: "after",
            upsert: true
        }
    );
    return savedAnalysis;
};

export const getClientAnalysisByClientId = async (clientId, ownerId) => {
    return await ClientAIAnalysis.findOne({ clientId, ownerId }).sort({ generatedAt: -1 });
};
