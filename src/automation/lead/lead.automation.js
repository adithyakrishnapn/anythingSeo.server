import { analyzeLead } from "../../agents/lead/lead.agent.js";
import { shouldSendFollowup } from "./lead.rules.js";
import { sendEmail } from "../../services/email.service.js";
import { generateFollowUpAnalysis } from "../../agents/followUp/followUp.agent.js";
import { getLeadAnalysisByLeadId } from "../../tools/lead.tools.js";
import followupTemlate from "../../templates/followup.template.js";

export const analyzeLeadScheduler = async(leads, analysis) => {
    for (const lead of leads) {
        try {
            await analyzeLead(lead._id);
            const analysis = await getLeadAnalysisByLeadId(lead._id);
            if(shouldSendFollowup(lead, analysis)) {
                generateFollowUpAnalysis(lead, analysis)
                    .then(async (email) => {
                        const html = followupTemlate(email.body)
                        await sendEmail(lead.email, email.subject, html);
                        lead.followupSendAt = new Date();
                        lead.followupCount = (lead.followupCount || 0) + 1;
                        await lead.save();
                    })
                    .catch((error) => {
                        console.error(`Error generating follow-up for lead with ID ${lead._id}: ${error.message}`);
                    });
            }
        } catch (error) {
            console.error(`Error analyzing lead with ID ${lead._id}: ${error.message}`);
        }
    }
}