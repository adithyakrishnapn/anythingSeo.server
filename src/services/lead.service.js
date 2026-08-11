import Lead from "../models/lead.model.js";

export const createLead = async (leadData, ownerId) => {
    const lead = await Lead.create({ ...leadData, ownerId });
    return lead;
};

export const updateLead = async (id, leadData, ownerId) => {
    const lead = await Lead.findOneAndUpdate(
        { _id: id, ownerId },
        leadData,
        { returnDocument: "after" }
    );
    return lead;
};

export const getLeads = async (ownerId) => {
    const leads = await Lead.find({ ownerId }).sort({ createdAt: -1 });
    return leads;
};

export const getLeadById = async (id, ownerId) => {
    const lead = await Lead.findOne({ _id: id, ownerId });
    return lead;
};

export const deleteLead = async (id, ownerId) => {
    const lead = await Lead.findOneAndDelete({ _id: id, ownerId });
    return lead;
};

export const convertLeadToCustomer = async (id, ownerId) => {
    const lead = await Lead.findOneAndUpdate(
        { _id: id, ownerId },
        { status: 'converted' },
        { returnDocument: "after" }
    );
    return lead;
};

export const addActivityToLead = async (id, activity, ownerId) => {
    const lead = await Lead.findOneAndUpdate(
        { _id: id, ownerId },
        { $push: { activities: activity } },
        { returnDocument: "after" }
    );
    return lead;
};

export const deleteActivityFromLead = async (id, activity, ownerId) => {
    const lead = await Lead.findOneAndUpdate(
        { _id: id, ownerId },
        { $pull: { activities: activity } },
        { returnDocument: "after" }
    );
    return lead;
};