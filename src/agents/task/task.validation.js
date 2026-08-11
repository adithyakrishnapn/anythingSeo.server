export const validateTaskCreation = (taskData) => {
     const requiredFields = ["title", "description", "priority", "dueDate",];
     for (const field of requiredFields) {
          if (!(field in taskData)) {
              throw new Error(`Missing field '${field}' in task data.`);
          }
      }
};

export const validateTaskAnalysis = (analysis) => {
    const requiredFields = ["priority", "reason", "recommendedAction"];
    for (const field of requiredFields) {
        if (!(field in analysis)) {
            throw new Error(`Missing field '${field}' in task analysis.`);
        }
    }

    const validPriorities = ["Low", "Medium", "High", "Critical"];
    if (!validPriorities.includes(analysis.priority)) {
        throw new Error(`Invalid task priority '${analysis.priority}' returned by AI.`);
    }

    if (!Array.isArray(analysis.reason)) {
        throw new Error("reason must be an array of strings.");
    }
};

export const validateTaskPrioritization = (prioritization) => {
    if (!prioritization || !Array.isArray(prioritization.prioritizedTasks)) {
        throw new Error("Invalid prioritization output: prioritizedTasks must be an array.");
    }

    const validPriorities = ["Low", "Medium", "High", "Critical"];
    for (const item of prioritization.prioritizedTasks) {
        if (!item.taskId || !item.priority || !Array.isArray(item.reason)) {
            throw new Error("Prioritized task item is missing taskId, priority, or reasons.");
        }
        if (!validPriorities.includes(item.priority)) {
            throw new Error(`Invalid priority level '${item.priority}' in prioritized task.`);
        }
    }
};

export const validateDailyTaskSummary = (summary) => {
    const requiredFields = ["dailySummary", "overdueCount", "dueTodayCount", "workloadStatus", "statusAnalysis", "recommendedNextActions"];
    for (const field of requiredFields) {
        if (!(field in summary)) {
            throw new Error(`Missing field '${field}' in daily task summary.`);
        }
    }

    if (typeof summary.overdueCount !== "number" || typeof summary.dueTodayCount !== "number") {
        throw new Error("overdueCount and dueTodayCount must be numbers.");
    }

    const validWorkloads = ["Optimal", "Overloaded", "Under-utilized"];
    if (!validWorkloads.includes(summary.workloadStatus)) {
        throw new Error(`Invalid workload status '${summary.workloadStatus}' returned by AI.`);
    }

    if (!Array.isArray(summary.recommendedNextActions)) {
        throw new Error("recommendedNextActions must be an array of strings.");
    }
};