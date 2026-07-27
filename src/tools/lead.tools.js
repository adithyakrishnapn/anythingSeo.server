import LeadAIAnalysis from '../models/LeadAIAnalysis.js';
import Lead from '../models/lead.model.js';

export const getLeadById = async (leadId) =>{
    return await Lead.findById(leadId).sort({ createdAt: -1 });
}

export const getAllLeads = async () => {
    return await Lead.find().sort({ createdAt: -1 });
}

export const getPrevLead = async () => {
    return await Lead.findOne().sort({ createdAt: -1 }).skip(1);
}

export const getLeadActivities = async (leadId) => {
    return await Lead.findById(leadId).select('activities notes');
}

export const saveLeadAnalysis = async (leadId, analysis) => {
    const savedAnalysis = await LeadAIAnalysis.create({
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

export const updateLeadAnalysis = async (leadId, analysis) => {
    const updatedAnalysis = await LeadAIAnalysis.findOneAndUpdate(
        { leadId },
        {
            score: analysis.score,
            priority: analysis.priority,
            risk: analysis.risk,
            conversionChance: analysis.conversionChance,
            reason: analysis.reason,
            recommendedAction: analysis.recommendedAction,
            generatedAt: new Date(),
        },
        {
            new: true,
            upsert: true,
        }
    );

    return updatedAnalysis;
};

export const getLeadAnalysisByLeadId = async (leadId) => {
    return await LeadAIAnalysis.findOne({ leadId });
}