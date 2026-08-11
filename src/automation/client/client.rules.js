export const shouldCreateTaskForClient = (client, clientAnalysis) => {
    // If client status is already cancelled or completed, no automation tasks are needed
    if (client.status === "cancelled" || client.status === "completed") {
        return false;
    }

    // Rule 1: High risk or Critical/At Risk health
    if (clientAnalysis.health === "Critical" || clientAnalysis.health === "At Risk" || clientAnalysis.riskScore > 50) {
        return true;
    }

    // Rule 2: Client inactivity
    if (clientAnalysis.health === "Inactive") {
        return true;
    }

    // Rule 3: Renewal is approaching (within 30 days)
    if (client.renewalDate) {
        const currentDate = new Date();
        const renewalDate = new Date(client.renewalDate);
        const differenceInDays = Math.ceil((renewalDate - currentDate) / (1000 * 60 * 60 * 24));
        if (differenceInDays >= 0 && differenceInDays <= 30) {
            return true;
        }
    }

    return false;
};
