import Lead from "../models/lead.model.js";

export const createLead = async (leadData) => {

    const lead = await Lead.create(leadData);

    return lead;

};

export const updateLead = async (id, leadData) => {
    const lead = await Lead.findByIdAndUpdate(id, leadData, { returnDocument: "after" });
    return lead;
}

export const getLeads = async () => {
    const leads = await Lead.find();
    return leads;
}

export const getLeadById = async(id)=>{
        const lead = await Lead.findById(id);
        return lead;
}

export const deleteLead = async(id)=>{
        const lead = await Lead.findByIdAndDelete(id);
        return lead;
}

export const convertLeadToCustomer = async(id)=>{
    const lead = await Lead.findByIdAndUpdate(id, { status: 'converted' }, { returnDocument: "after" });
    return lead;
}

export const addActivityToLead = async(id, activity)=>{
    const lead = await Lead.findByIdAndUpdate(id, { $push: { activities: activity } },     {
        returnDocument: "after"
    });
    return lead;
}

export const deleteActivityFromLead = async(id, activity)=>{
    const lead = await Lead.findByIdAndUpdate(id, 
        {
            $pull: { activities: activity }
        },
        { returnDocument: "after" }
    );

    return lead;
}