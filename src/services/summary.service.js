import Summary from "../models/summary.model.js";

// export const getLatestSummary = async () =>{
//     return await Summary.findOne().sort({ summaryDate: -1 });
// }

export const updatePdfPath = async (dataId, pdfPath) => {
    return await Summary.findByIdAndUpdate(dataId, { pdfPath }, { new: true });
}

export const getSummaryById = async (summaryId) => {
    return await Summary.findById(summaryId);
}

export const getLatestSummary = async () => {
    return await Summary.findOne().sort({ summaryDate: -1 });
}