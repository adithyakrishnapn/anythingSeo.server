import LeadAIAnalysis from "../models/LeadAIAnalysis.js";


export const getLatestLeadPriorities = async () => {
    return await LeadAIAnalysis.aggregate([
        {
            $sort: { createdAt: -1 } // latest first
        },
        {
            $group: {
                _id: "$leadId",
                priority: { $first: "$priority" }
            }
        },
        {
            $project: {
                _id: 0,
                leadId: "$_id",
                priority: 1
            }
        }
    ]);
};

export const getleadAnalysis = async (leadId) => {
    return await LeadAIAnalysis.findOne({ leadId })
        .sort({ createdAt: -1 });
}