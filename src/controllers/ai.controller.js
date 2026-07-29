import { analyzeLead } from "../agents/lead/lead.agent.js";
import { generateFollowUpAnalysis } from "../agents/followUp/followUp.agent.js";
import { getLeadById, getLeadAnalysisByLeadId } from "../tools/lead.tools.js";
import { sendEmail } from "../services/email.service.js";
import followupTemlate from "../templates/followup.template.js"
import { createTaskForLead } from "../agents/task/task.agent.js";

export const analyzeLeadController = async (req, res) => {
    try {
        const { leadId } = req.params;
        const analysis = await analyzeLead(leadId);
        res.status(200).json({ success: true, message: "Lead analyzed successfully", data: analysis });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const followupLead = async(req,res) =>{
    try{
        const id = req.params.id;
        const lead = await getLeadById(id);
        const analysis = await getLeadAnalysisByLeadId(id);
        const followUpAnalysis = await generateFollowUpAnalysis(lead, analysis);
        const html = followupTemlate(followUpAnalysis.body)
        sendEmail(lead.email, followUpAnalysis.subject, html);
        res.status(200).json({ success: true, message: "Follow-up email sent successfully" });
    }catch(error){
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const createTaskForLeadController = async (req,res) =>{
    try{
        const { leadId } = req.params;
        const lead = await getLeadById(leadId);
        if(!lead){
            throw new Error("Lead not found.");
        }
        const analysis = await getLeadAnalysisByLeadId(leadId);
        if (!analysis) {
            throw new Error("Lead analysis not found.");
        }
        const task = await createTaskForLead(leadId);
        res.status(200).json({ success: true, message: "Task created successfully", data: task });
    }catch(error){
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}