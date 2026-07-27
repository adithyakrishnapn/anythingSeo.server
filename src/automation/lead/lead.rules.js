export const shouldSendFollowup = (lead, analysis) => {

    const currentDate = new Date();

    const differenceInDays = Math.floor(
        (currentDate - lead.followupSendAt) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays < 3) return false;

    if (lead.status === "converted") return false;

    if (lead.status === "lost") return false;

    if (analysis.priority !== "High") return false;

    return true;
};

