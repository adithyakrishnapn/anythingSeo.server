import { analyzeLead } from "../../agents/lead/lead.agent.js";
import { shouldSendFollowup, shouldCreateTaskForLead } from "./lead.rules.js";
import { sendEmail } from "../../services/email.service.js";
import { generateFollowUpAnalysis } from "../../agents/followUp/followUp.agent.js";
import { getLeadAnalysisByLeadId } from "../../tools/lead.tools.js";
import followupTemlate from "../../templates/followup.template.js";
import { createTaskForLead } from "../../agents/task/task.agent.js";
import { getTaskByLeadId, changeStatusByLeadId } from "../../tools/task.tools.js";

export const analyzeLeadScheduler = async (leads) => {

    for (const lead of leads) {

        try {

            await analyzeLead(lead._id);

            const analysis = await getLeadAnalysisByLeadId(lead._id);


            if (shouldSendFollowup(lead, analysis)) {

                const generateFollowUp = await generateFollowUpAnalysis(
                    lead,
                    analysis
                );

                if (
                    !generateFollowUp ||
                    !generateFollowUp.subject ||
                    !generateFollowUp.body
                ) {
                    console.error(
                        `Invalid follow-up generated for lead ${lead._id}`
                    );
                } else {

                    const html = followupTemlate(generateFollowUp.body);

                    await sendEmail(
                        lead.email,
                        generateFollowUp.subject,
                        html
                    );

                    lead.followupSendAt = new Date();
                    lead.followupCount =
                        (lead.followupCount || 0) + 1;

                    await lead.save();
                }
            }


            if (shouldCreateTaskForLead(lead, analysis)) {

                const task = await getTaskByLeadId(lead._id);

                const taskPayload = {
                    title: `Task for ${lead.name}`,
                    description: analysis.recommendedAction || "Contact the lead.",
                    assignedTo: lead.assignedTo,
                    priority: analysis.priority || "Medium",
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    status: "Pending",
                    createdBy: lead.createdBy
                };

                // No task exists
                if (!task) {

                    await createTaskForLead(lead._id, taskPayload);

                    console.log(`Task created for lead ${lead._id}`);

                } else {

                    if (task.status === "Pending") {

                        const currentDate = new Date();

                        const differenceInDays = Math.floor(
                            (currentDate - task.dueDate) /
                            (1000 * 60 * 60 * 24)
                        );

                        // Pending task expired
                        if (differenceInDays > 0) {

                            await changeStatusByLeadId(lead._id);

                            await createTaskForLead(lead._id, taskPayload);

                            console.log(`Expired task replaced for lead ${lead._id}`);

                        } else {

                            console.log(`Active task already exists for lead ${lead._id}`);

                        }

                    }

                    // Previous task completed or cancelled
                    else {

                        await createTaskForLead(lead._id, taskPayload);

                        console.log(`New task created for lead ${lead._id}`);

                    }
                }
            }
        } catch (error) {

            console.error(
                `Error analyzing lead ${lead._id}: ${error.message}`
            );

        }
    }
};