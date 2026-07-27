const requiredFields = [
    "score",
    "priority",
    "risk",
    "conversionChance",
    "reason",
    "recommendedAction"
];

export const validateLeadAnalysis = (analysis) => {
    for (const field of requiredFields) {
        if (!(field in analysis)) {
            throw new Error(`Missing field '${field}' in AI response.`);
        }
    }
}