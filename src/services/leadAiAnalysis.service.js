import mongoose from "mongoose";
import LeadAIAnalysis from "../models/LeadAIAnalysis.js";

export const getLatestLeadPriorities = async (ownerId) => {
    return await LeadAIAnalysis.aggregate([
        {
            $match: { ownerId: new mongoose.Types.ObjectId(ownerId) }
        },
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

export const getleadAnalysis = async (leadId, ownerId) => {
    return await LeadAIAnalysis.findOne({ leadId, ownerId })
        .sort({ createdAt: -1 });
};