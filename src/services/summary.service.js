import Summary from "../models/summary.model.js";

export const updatePdfPath = async (dataId, pdfPath, ownerId) => {
    // If ownerId is provided, enforce it, otherwise update globally (for automation run compatibility)
    const query = ownerId ? { _id: dataId, ownerId } : { _id: dataId };
    return await Summary.findOneAndUpdate(query, { pdfPath }, { returnDocument: "after" });
}

export const getSummaryById = async (summaryId, ownerId) => {
    return await Summary.findOne({ _id: summaryId, ownerId });
}

export const getLatestSummary = async (ownerId) => {
    return await Summary.findOne({ ownerId }).sort({ summaryDate: -1 });
}