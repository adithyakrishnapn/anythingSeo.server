import Task from "../models/task.model.js";
import Lead from "../models/lead.model.js";
import LeadAIAnalysis from "../models/LeadAIAnalysis.js";

export const createTaskForLeadTool = async (leadId, taskData = {}) => {

    // Check if the lead exists
    const lead = await Lead.findById(leadId);

    if (!lead) {
        throw new Error("Lead not found");
    }

    // Get the latest AI analysis
    const analysis = await LeadAIAnalysis
        .findOne({ leadId })
        .sort({ generatedAt: -1 });

    const task = await Task.create({
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


export const getTaskByLeadId = async (leadId) => {
    return (await Task.find({ relatedTo: leadId, relatedModel: "Lead" })).sort({ createdAt: -1 });
}

export const changeStatusByLeadId = async (leadId) => {
    return await Task.findOneAndUpdate(
        {
            relatedTo: leadId,
            relatedModel: "Lead"
        },
        {
            status: "Cancelled"
        },
        {
            new: true
        }
    );
};