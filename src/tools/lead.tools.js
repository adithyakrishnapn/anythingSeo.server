import LeadAIAnalysis from '../models/LeadAIAnalysis.js';
import Lead from '../models/lead.model.js';

export const getLeadById = async (leadId, ownerId) => {
    return await Lead.findOne({ _id: leadId, ownerId }).sort({ createdAt: -1 });
};

export const getAllLeads = async (ownerId) => {
    return await Lead.find({ ownerId }).sort({ createdAt: -1 });
};

export const getPrevLead = async (ownerId) => {
    return await Lead.findOne({ ownerId }).sort({ createdAt: -1 }).skip(1);
};

export const getLeadActivities = async (leadId, ownerId) => {
    return await Lead.findOne({ _id: leadId, ownerId }).select('activities notes');
};

export const saveLeadAnalysis = async (leadId, analysis, ownerId) => {
    const savedAnalysis = await LeadAIAnalysis.create({
        ownerId,
        leadId,
        score: analysis.score,
        priority: analysis.priority,
        risk: analysis.risk,
        conversionChance: analysis.conversionChance,
        reason: analysis.reason,
        recommendedAction: analysis.recommendedAction,
    });

    return savedAnalysis;
};

export const updateLeadAnalysis = async (leadId, analysis, ownerId) => {
    const updatedAnalysis = await LeadAIAnalysis.findOneAndUpdate(
        { leadId, ownerId },
        {
            ownerId,
            score: analysis.score,
            priority: analysis.priority,
            risk: analysis.risk,
            conversionChance: analysis.conversionChance,
            reason: analysis.reason,
            recommendedAction: analysis.recommendedAction,
            generatedAt: new Date(),
        },
        {
            returnDocument: "after",
            upsert: true,
        }
    );

    return updatedAnalysis;
};

export const getLeadAnalysisByLeadId = async (leadId, ownerId) => {
    return await LeadAIAnalysis.findOne({ leadId, ownerId });
};