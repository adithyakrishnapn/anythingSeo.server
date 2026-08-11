import { getSummaryStatistics } from "../tools/summary.tools.js";
import { generateDailySummaryScheduler } from "../automation/summary/summary.automation.js";
import path from "path";
import { getSummaryById, getLatestSummary } from "../services/summary.service.js";
import axios from "axios";

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

        // If the PDF is stored on Cloudinary (URL)
        if (summary.pdfPath.startsWith("http://") || summary.pdfPath.startsWith("https://")) {
            const response = await axios({
                method: "get",
                url: summary.pdfPath,
                responseType: "stream"
            });

            const fileName = path.basename(summary.pdfPath);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            
            return response.data.pipe(res);
        }

        const absolutePath = path.resolve(summary.pdfPath);

        return res.download(
            absolutePath,
            path.basename(absolutePath)
        );
    } catch (error) {
        console.error("Download PDF Error:", error);
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

        // If the PDF is stored on Cloudinary (URL)
        if (latestSummary.pdfPath.startsWith("http://") || latestSummary.pdfPath.startsWith("https://")) {
            const response = await axios({
                method: "get",
                url: latestSummary.pdfPath,
                responseType: "stream"
            });

            const fileName = path.basename(latestSummary.pdfPath);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
            
            return response.data.pipe(res);
        }

        const absolutePath = path.resolve(latestSummary.pdfPath);
        return res.download(
            absolutePath,
            path.basename(absolutePath)
        );
    } catch (error) {
        console.error("Download Latest PDF Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to download latest PDF"
        });
    }
};
