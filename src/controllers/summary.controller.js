import { getSummaryStatistics } from "../tools/summary.tools.js";
import { generateDailySummaryScheduler } from "../automation/summary/summary.automation.js";
import path from "path";
import { getSummaryById, getLatestSummary } from "../services/summary.service.js";

export const generateSummary = async (req, res) => {
    try {
        const stats = await getSummaryStatistics(req.ownerId);
        const response = await generateDailySummaryScheduler(stats, req.ownerId);
        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error("Summary Generation Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const downloadSummaryPDF = async (req, res) => {
    try {
        const summary = await getSummaryById(req.params.id, req.ownerId);

        if (!summary) {
            return res.status(404).json({
                success: false,
                message: "Summary not found or unauthorized"
            });
        }

        const absolutePath = path.resolve(summary.pdfPath);

        return res.download(
            absolutePath,
            path.basename(absolutePath)
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to download PDF"
        });
    }
};

export const downlaodLatestSummaryPDF = async (req, res) => {
    try {
        const latestSummary = await getLatestSummary(req.ownerId);
        if (!latestSummary) {
            return res.status(404).json({
                success: false,
                message: "Latest summary not found or unauthorized"
            });
        }
        const absolutePath = path.resolve(latestSummary.pdfPath);
        return res.download(
            absolutePath,
            path.basename(absolutePath)
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to download latest PDF"
        });
    }
};
