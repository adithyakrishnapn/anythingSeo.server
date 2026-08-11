import { analyzeLead } from "../agents/lead/lead.agent.js";
import { generateFollowUpAnalysis } from "../agents/followUp/followup.agent.js";
import { getLeadById, getLeadAnalysisByLeadId } from "../tools/lead.tools.js";
import { sendEmail } from "../services/email.service.js";
import followupTemlate from "../templates/followup.template.js";
import { createTaskForLead, analyzeTask, prioritizeTasks, generateDailyTaskSummary } from "../agents/task/task.agent.js";
import { generateDailySummaryScheduler } from "../automation/summary/summary.automation.js";
import { getSummaryStatistics } from "../tools/summary.tools.js";
import { analyzeClient, generateMeetingSummary } from "../agents/client/client.agent.js";
import Task from "../models/task.model.js";

export const analyzeLeadController = async (req, res) => {
    try {
        const { leadId } = req.params;
        const analysis = await analyzeLead(leadId, req.ownerId);
        res.status(200).json({ success: true, message: "Lead analyzed successfully", data: analysis });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const followupLead = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await getLeadById(id, req.ownerId);
        if (!lead) {
            return res.status(404).json({ success: false, message: "Lead not found or unauthorized" });
        }
        const analysis = await getLeadAnalysisByLeadId(id, req.ownerId);
        const followUpAnalysis = await generateFollowUpAnalysis(lead, analysis, req.ownerId);
        const html = followupTemlate(followUpAnalysis.body);
        await sendEmail(lead.email, followUpAnalysis.subject, html, "", req.ownerId);
        res.status(200).json({ success: true, message: "Follow-up email sent successfully" });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTaskForLeadController = async (req, res) => {
    try {
        const { leadId } = req.params;
        const lead = await getLeadById(leadId, req.ownerId);
        if (!lead) {
            return res.status(404).json({ success: false, message: "Lead not found or unauthorized." });
        }
        const analysis = await getLeadAnalysisByLeadId(leadId, req.ownerId);
        if (!analysis) {
            return res.status(404).json({ success: false, message: "Lead analysis not found." });
        }
        const task = await createTaskForLead(leadId, req.ownerId);
        res.status(200).json({ success: true, message: "Task created successfully", data: task });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const summaryController = async (req, res) => {
    try {
        const statistics = await getSummaryStatistics(req.ownerId);
        const stats = await generateDailySummaryScheduler(statistics, req.ownerId);
        res.status(200).json({ success: true, message: "Daily summary generated successfully", data: stats });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =========================================================================
   CLIENT AI AGENT CONTROLLERS
   ========================================================================= */

export const analyzeClientController = async (req, res) => {
    try {
        const { clientId } = req.params;
        const analysis = await analyzeClient(clientId, req.ownerId);
        res.status(200).json({ success: true, message: "Client analyzed successfully", data: analysis });
    } catch (error) {
        console.error("AI Controller analyzeClient Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const meetingSummaryController = async (req, res) => {
    try {
        const { clientId } = req.params;
        const summary = await generateMeetingSummary(clientId, req.ownerId);
        res.status(200).json({ success: true, message: "Meeting summary generated successfully", data: summary });
    } catch (error) {
        console.error("AI Controller meetingSummary Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =========================================================================
   TASK AI AGENT CONTROLLERS
   ========================================================================= */

export const analyzeTaskController = async (req, res) => {
    try {
        const { taskId } = req.params;
        const analysis = await analyzeTask(taskId, req.ownerId);
        res.status(200).json({ success: true, message: "Task analyzed successfully", data: analysis });
    } catch (error) {
        console.error("AI Controller analyzeTask Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const prioritizeTasksController = async (req, res) => {
    try {
        // Fetch pending tasks specifically for this owner
        const tasks = await Task.find({ status: "Pending", ownerId: req.ownerId });
        if (tasks.length === 0) {
            return res.status(200).json({ success: true, message: "No pending tasks found to prioritize.", data: [] });
        }
        const prioritization = await prioritizeTasks(tasks, req.ownerId);
        res.status(200).json({ success: true, message: "Tasks prioritized successfully", data: prioritization });
    } catch (error) {
        console.error("AI Controller prioritizeTasks Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const dailyTaskSummaryController = async (req, res) => {
    try {
        const tasks = await Task.find({ ownerId: req.ownerId });
        const summary = await generateDailyTaskSummary(tasks, req.ownerId);
        res.status(200).json({ success: true, message: "Daily task summary generated successfully", data: summary });
    } catch (error) {
        console.error("AI Controller dailyTaskSummary Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};