import { getLatestLeadPriorities, getleadAnalysis } from '../services/leadAiAnalysis.service.js';
import { analyzeLead } from "../agents/lead/lead.agent.js";

export const getPrioritiesController = async (req, res) => {
    try {
        const priorities = await getLatestLeadPriorities();
        res.status(200).json({ success: true, data: priorities });
    } catch (error) {
        console.error("Lead Analysis Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getleadAnalysisController = async (req, res) => {
    try {
        const { leadId } = req.params;
        console.log(req.params);
        console.log(req.params.leadId);
        const analysis = await getleadAnalysis(leadId);
        console.log("Lead Analysis Data:", analysis);
        res.status(200).json({ success: true, data: analysis });
    } catch (error) {
        console.error("Lead Analysis Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createLeadAnalysisController = async (req, res) => {
    try {
        const { leadId } = req.params;
        const analysisData = await analyzeLead(leadId);
        res.status(200).json({ success: true, data: analysisData });
    } catch (error) {
        console.error("Lead Analysis Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
