import { generateDailySummary } from "../../agents/summary/summary.agent.js";
import { sendEmail } from "../../services/email.service.js";
import { summaryTemplate } from "../../templates/summary.template.js";
import { createSummaryStatistics } from "../../tools/summary.tools.js";
import {     } from "../../services/pdf.service.js";



export const generateDailySummaryScheduler = async (statistics) => {
    try {
        const summary = await generateDailySummary(statistics);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const stats = {
            ...statistics,
            summaryDate: today,

            summary: summary.summary,

            recommendations: summary.recommendations,

            risks: summary.risks,

            highlights: summary.highlights
        };
        console.log("Summary Statistics to be saved:", stats);
        const savedSummary = await createSummaryStatistics(stats);
        const pdfPath = await generatePDF(savedSummary._id, "daily-summary", `daily-summary-${today.toISOString().split('T')[0]}`, "pdfs/daily-summaries", (doc) => {
            doc
                .fontSize(22)
                .text("CRM Daily Summary", {
                    align: "center"
                });

            doc.moveDown();

            doc.text(`Date : ${savedSummary.summaryDate.toDateString()}`);

            doc.moveDown();

            doc.fontSize(16).text("Statistics");

            doc.moveDown();

            doc.fontSize(12);

            doc.text(`Total Leads : ${savedSummary.totalLeads}`);
            doc.text(`New Leads : ${savedSummary.newLeads}`);
            doc.text(`Converted : ${savedSummary.convertedLeads}`);

            doc.moveDown();

            doc.fontSize(16).text("AI Summary");

            doc.moveDown();

            doc.fontSize(12).text(savedSummary.summary);

            doc.moveDown();

            doc.fontSize(16).text("Recommendations");

            savedSummary.recommendations.forEach(item =>
                doc.text(`• ${item}`)
            );
        });


        const html = summaryTemplate(summary.summary, summary.recommendations, summary.risks, summary.highlights);
        await sendEmail(process.env.SUMMARY_EMAIL, "Daily CRM Summary", html);
        return summary;
    } catch (error) {
        console.error("Error generating daily summary:", error);
        throw error;
    }
};