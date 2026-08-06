export const validateSummaryStatistics = (statistics) => {

    const requiredFields = [
        "totalLeads",
        "newLeads",
        "highPriorityLeads",
        "convertedLeads",
        "lostLeads",
        "followupEmailsSent",
        "tasksCreated",
        "overdueTasks"
    ];

    for (const field of requiredFields) {

        if (statistics[field] === undefined || statistics[field] === null) {
            throw new Error(`Missing field '${field}' in summary statistics.`);
        }

    }

    return true;
};


export const validateSummaryOutput = (summary) => {

    if (!summary || !summary.summary) {
        throw new Error("Missing 'summary' in AI response.");
    }

    return true;
};