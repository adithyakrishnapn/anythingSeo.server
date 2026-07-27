import cron from "node-cron";
import { getAllLeads } from "../tools/lead.tools.js"
import { analyzeLead } from "../agents/lead/lead.agent.js";
import { analyzeLeadScheduler } from "../automation/lead/lead.automation.js";

export const startLeadScheduler = () => {
    cron.schedule("0 9 * * *", async () => {
        console.log("Running lead analysis job...");

        const leads = await getAllLeads();
        analyzeLeadScheduler(leads);



    })
}