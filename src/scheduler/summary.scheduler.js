import cron from "node-cron";
import { generateDailySummaryScheduler } from "../automation/summary/summary.automation.js";
import { getSummaryStatistics } from "../tools/summary.tools.js";


export const startSummaryScheduler = () => {
    cron.schedule("0 18 * * *", async () => {
        console.log("Running daily summary job...");
        const statistics = await getSummaryStatistics();
        await generateDailySummaryScheduler(statistics);
    });
};
