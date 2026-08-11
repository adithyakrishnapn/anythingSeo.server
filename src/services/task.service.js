import Task from "../models/task.model.js";
import { getClientForTask } from "../tools/task.tools.js";
import { getLeadAnalysisByLeadId } from "../tools/lead.tools.js";
import { generateFollowUpAnalysis } from "../agents/followUp/followUp.agent.js";
import { analyzeLead } from "../agents/lead/lead.agent.js";
import followupTemplate from "../templates/followup.template.js";
import { sendEmail } from "../services/email.service.js";
import { addActivityToLead } from "./lead.service.js";
import { addActivityToClient } from "./client.service.js";
import { generateResponse } from "../ai/ollama.service.js";

/* ===========================
   CREATE
=========================== */

export const createTask = async (taskData, ownerId) => {
    return await Task.create({ ...taskData, ownerId });
};


/* ===========================
   GET
=========================== */

export const getAllTasks = async (ownerId) => {
    return await Task.find({ ownerId })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
};

export const getTaskById = async (taskId, ownerId) => {
    return await Task.findOne({ _id: taskId, ownerId })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email");
};

export const getTasksByRelated = async (relatedTo, ownerId) => {
    return await Task.find({ relatedTo, ownerId });
};

export const getTasksByStatus = async (status, ownerId) => {
    return await Task.find({ status, ownerId });
};

export const getTasksByPriority = async (priority, ownerId) => {
    return await Task.find({ priority, ownerId });
};

export const getTasksByAssignedUser = async (userId, ownerId) => {
    return await Task.find({ assignedTo: userId, ownerId });
};


/* ===========================
   UPDATE
=========================== */

export const updateTask = async (taskId, updateData, ownerId) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, ownerId },
        updateData,
        { returnDocument: "after" }
    );
};


/* ===========================
   STATUS
=========================== */

export const updateTaskStatus = async (taskId, status, ownerId) => {
    const update = {
        status
    };

    if (status === "Completed") {
        update.completedAt = new Date();
    }

    return await Task.findOneAndUpdate(
        { _id: taskId, ownerId },
        update,
        { returnDocument: "after" }
    );
};


/* ===========================
   NOTES
=========================== */

export const addNote = async (taskId, note, ownerId) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, ownerId },
        {
            $push: {
                notes: note
            }
        },
        { returnDocument: "after" }
    );
};

export const removeNote = async (taskId, noteIndex, ownerId) => {
    const task = await Task.findOne({ _id: taskId, ownerId });

    if (!task) return null;

    task.notes.splice(noteIndex, 1);

    await task.save();

    return task;
};


/* ===========================
   COMMENTS
=========================== */

export const addComment = async (taskId, comment, ownerId) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, ownerId },
        {
            $push: {
                comments: comment
            }
        },
        { returnDocument: "after" }
    );
};


/* ===========================
   ATTACHMENTS
=========================== */

export const addAttachment = async (taskId, attachment, ownerId) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, ownerId },
        {
            $push: {
                attachments: attachment
            }
        },
        { returnDocument: "after" }
    );
};

export const removeAttachment = async (taskId, attachmentId, ownerId) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, ownerId },
        {
            $pull: {
                attachments: {
                    _id: attachmentId
                }
            }
        },
        { returnDocument: "after" }
    );
};


/* ===========================
   HISTORY
=========================== */

export const addHistory = async (taskId, history, ownerId) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, ownerId },
        {
            $push: {
                history
            }
        },
        { returnDocument: "after" }
    );
};


/* ===========================
   DELETE
=========================== */

export const deleteTask = async (taskId, ownerId) => {
    return await Task.findOneAndDelete({ _id: taskId, ownerId });
};


/* ===========================
   DASHBOARD
=========================== */

export const getPendingTasks = async (ownerId) => {
    return await Task.find({
        ownerId,
        status: "Pending"
    });
};

export const getOverdueTasks = async (ownerId) => {
    return await Task.find({
        ownerId,
        dueDate: {
            $lt: new Date()
        },
        status: {
            $ne: "Completed"
        }
    });
};

export const getTasksDueToday = async (ownerId) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return await Task.find({
        ownerId,
        dueDate: {
            $gte: start,
            $lte: end
        }
    });
};

export const sendTaskFollowUpEmail = async (taskId, ownerId) => {
    const task = await Task.findOne({ _id: taskId, ownerId });
    if (!task) {
        throw new Error("Task not found or unauthorized.");
    }

    const clientOrLead = await getClientForTask(task, ownerId);
    if (!clientOrLead) {
        throw new Error("No associated Client, Lead, or Project found for this task to send a follow-up email.");
    }

    let emailSubject, emailBody, toEmail, displayName;

    if (task.relatedModel === "Lead") {
        toEmail = clientOrLead.email;
        displayName = clientOrLead.name;

        let analysis = await getLeadAnalysisByLeadId(clientOrLead._id, ownerId);
        if (!analysis) {
            analysis = await analyzeLead(clientOrLead._id, ownerId);
        }

        const followUp = await generateFollowUpAnalysis(clientOrLead, analysis, ownerId);
        emailSubject = followUp.subject;
        emailBody = followUp.body;

        const activityStr = `[Email Sent] Follow-up email sent from task: "${task.title}". Subject: ${emailSubject}`;
        await addActivityToLead(clientOrLead._id, activityStr, ownerId);
    } else {
        toEmail = clientOrLead.email;
        displayName = clientOrLead.name;

        const systemPrompt = `You are a professional CRM follow-up AI agent. Based on the client details and task description, generate a friendly follow-up email.
Return ONLY valid JSON in format:
{
  "subject": "Email Subject",
  "body": "Email body content"
}
Do not output any markdown codeblock backticks or conversational filler outside the JSON structure.`;

        const userPrompt = `
Client Name: ${clientOrLead.name}
Company: ${clientOrLead.company || 'N/A'}
Task Title: ${task.title}
Task Description: ${task.description}
Due Date: ${task.dueDate}
`;

        const responseText = await generateResponse(systemPrompt, userPrompt, ownerId);
        
        let followUp;
        try {
            let cleanText = responseText.trim();
            if (cleanText.startsWith("```")) {
                const match = cleanText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
                if (match) cleanText = match[1].trim();
            }
            followUp = JSON.parse(cleanText);
        } catch (err) {
            console.error("Failed to parse AI client follow-up JSON:", responseText);
            throw new Error("Failed to generate follow-up email from AI agent.");
        }

        emailSubject = followUp.subject;
        emailBody = followUp.body;

        const activityStr = `[Email Sent] Follow-up email sent from task: "${task.title}". Subject: ${emailSubject}`;
        await addActivityToClient(clientOrLead._id, activityStr, ownerId);
    }

    const html = followupTemplate(emailBody);
    await sendEmail(toEmail, emailSubject, html, "", ownerId);

    task.notes = (task.notes || "") + `\n\n[AI Follow-up Sent] Sent follow-up email to ${displayName} (${toEmail}) on ${new Date().toLocaleDateString()} with subject: "${emailSubject}"`;
    await task.save();

    return {
        success: true,
        message: `Follow-up email sent successfully to ${displayName} (${toEmail})`,
        data: {
            subject: emailSubject,
            body: emailBody
        }
    };
};