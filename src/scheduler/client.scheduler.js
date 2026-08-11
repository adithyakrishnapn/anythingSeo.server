import cron from "node-cron";
import { getAllClients } from "../tools/client.tools.js";
import { analyzeClientsScheduler } from "../automation/client/client.automation.js";

export const startClientScheduler = () => {
    // Run daily at 9:00 AM
    cron.schedule("0 9 * * *", async () => {
        console.log("Running scheduled client analysis job...");
        try {
            const clients = await getAllClients();
            await analyzeClientsScheduler(clients);
        } catch (error) {
            console.error("Scheduled client analysis job error:", error);
        }
    });
};
