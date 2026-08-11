import Lead from '../models/lead.model.js';
import Task from '../models/task.model.js';
import LeadAIAnalysis from '../models/LeadAIAnalysis.js';
import Summary from '../models/summary.model.js';

export const getTotalLeads = async (ownerId) => {
    return await Lead.countDocuments({ ownerId });
};

export const getNewLeads = async (ownerId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await Lead.countDocuments({ ownerId, createdAt: { $gte: startOfDay } });
};

export const getHighPriorityLeads = async (ownerId) => {
    return await Lead.countDocuments({ ownerId, priority: "High" });
};

export const getConvertedLeads = async (ownerId) => {
    // Check both lowercase and uppercase to be safe
    return await Lead.countDocuments({ 
        ownerId, 
        status: { $in: ["converted", "Converted"] } 
    });
};

export const getFollowupEmailsSent = async (ownerId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await LeadAIAnalysis.countDocuments({
        ownerId,
        followupSendAt: {
            $gte: startOfDay
        }
    });
};

export const getTasksCreated = async (ownerId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return await Task.countDocuments({
        ownerId,
        createdAt: {
            $gte: startOfDay
        }
    });
};

export const getOverdueTasks = async (ownerId) => {
    return await Task.countDocuments({
        ownerId,
        status: "Pending",
        dueDate: {
            $lt: new Date()
        }
    });
};

export const getLostLeads = async (ownerId) => {
    return await Lead.countDocuments({ 
        ownerId, 
        status: { $in: ["lost", "Lost"] } 
    });
};

export const getSummaryStatistics = async (ownerId) => {
    return {
        totalLeads: await getTotalLeads(ownerId),
        newLeads: await getNewLeads(ownerId),
        highPriorityLeads: await getHighPriorityLeads(ownerId),
        convertedLeads: await getConvertedLeads(ownerId),
        lostLeads: await getLostLeads(ownerId),
        followupEmailsSent: await getFollowupEmailsSent(ownerId),
        tasksCreated: await getTasksCreated(ownerId),
        overdueTasks: await getOverdueTasks(ownerId)
    };
};

export const createSummaryStatistics = async (statistics, ownerId) => {
    const summary = new Summary({ ...statistics, ownerId });
    return await summary.save();
};