import Lead from '../models/lead.model.js';
import Task from '../models/task.model.js';
import LeadAIAnalysis from '../models/LeadAIAnalysis.js';
import Summary from '../models/summary.model.js';

export const getTotalLeads = async()=>{
    return await Lead.countDocuments();
}

export const getNewLeads = async ()=>{
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await Lead.countDocuments({ createdAt : { $gte: startOfDay } });
}

export const getHighPriorityLeads = async()=>{
    return await Lead.countDocuments({ priority: "High" });
}

export const getConvertedLeads = async()=>{
    return await Lead.countDocuments({ status: "Converted" });
}

export const getFollowupEmailsSent = async () => {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await LeadAIAnalysis.countDocuments({
        followupSendAt: {
            $gte: startOfDay
        }
    });

};

export const getTasksCreated = async () => {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await Task.countDocuments({
        createdAt: {
            $gte: startOfDay
        }
    });

};

export const getOverdueTasks = async () => {

    return await Task.countDocuments({
        status: "Pending",
        dueDate: {
            $lt: new Date()
        }
    });

};

export const getLostLeads = async()=>{
    return await Lead.countDocuments({ status: "Lost" });
}

export const getSummaryStatistics = async () => {

    return {
        totalLeads: await getTotalLeads(),
        newLeads: await getNewLeads(),
        highPriorityLeads: await getHighPriorityLeads(),
        convertedLeads: await getConvertedLeads(),
        lostLeads: await getLostLeads(),
        followupEmailsSent: await getFollowupEmailsSent(),
        tasksCreated: await getTasksCreated(),
        overdueTasks: await getOverdueTasks()
    };

};


export const createSummaryStatistics = async (statistics) => {
    const summary = new Summary(statistics);
    return await summary.save();
};