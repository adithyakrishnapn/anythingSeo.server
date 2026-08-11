export const validateClientAnalysis = (analysis) => {
    const requiredFields = ["health", "riskScore", "risks", "opportunities", "recommendedActions", "summary"];
    for (const field of requiredFields) {
        if (!(field in analysis)) {
            throw new Error(`Missing field '${field}' in client analysis.`);
        }
    }

    const validHealth = ["Healthy", "At Risk", "Inactive", "Critical"];
    if (!validHealth.includes(analysis.health)) {
        throw new Error(`Invalid health status '${analysis.health}' returned by AI.`);
    }

    if (typeof analysis.riskScore !== "number" || analysis.riskScore < 0 || analysis.riskScore > 100) {
        throw new Error(`Invalid riskScore '${analysis.riskScore}' returned by AI.`);
    }

    if (!Array.isArray(analysis.risks) || !Array.isArray(analysis.opportunities) || !Array.isArray(analysis.recommendedActions)) {
        throw new Error("risks, opportunities, and recommendedActions must be arrays.");
    }
};

export const validateClientMeetingSummary = (summary) => {
    const requiredFields = ["summary", "activeProjects", "pendingTasks", "risks", "recommendedDiscussionPoints"];
    for (const field of requiredFields) {
        if (!(field in summary)) {
            throw new Error(`Missing field '${field}' in meeting summary.`);
        }
    }

    if (!Array.isArray(summary.activeProjects) || !Array.isArray(summary.pendingTasks) || !Array.isArray(summary.risks) || !Array.isArray(summary.recommendedDiscussionPoints)) {
        throw new Error("activeProjects, pendingTasks, risks, and recommendedDiscussionPoints must be arrays.");
    }
};
