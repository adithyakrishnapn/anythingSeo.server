import * as leadService from "../services/lead.service.js"


export const createLead = async (req, res) => {
    try {
        const lead = await leadService.createLead(req.body);

        return res.status(200).json({
            success: true,
            message: 'Lead created successfully',
            data: lead
        })
    } catch (error) {
        console.error('Error creating lead:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating lead',
            error: error.message
        })
    }
}

export const updateLead = async (req, res) => {
    try {
        const lead = await leadService.updateLead(req.params.id, req.body);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Lead updated successfully',
            data: lead
        })
    } catch (error) {
        console.error('Error updating lead:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating lead',
            error: error.message
        })
    }
}


export const getLeads = async (req, res) => {
    try {
        const leads = await leadService.getLeads();
        return res.status(200).json({
            success: true,
            message: 'Leads fetched successfully',
            data: leads
        })
    } catch (error) {
        console.error('Error fetching leads:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching leads',
            error: error.message
        })
    }
}


export const getLeadbyId = async (req, res) => {
    try {
        const lead = await leadService.getLeadById(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Lead fetched successfully',
            data: lead
        })
    } catch (error) {
        console.error('Error fetching lead by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching lead by ID',
            error: error.message
        })
    }
}

export const deleteLeadbyId = async (req, res) => {
    try {
        const lead = await leadService.deleteLead(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Lead deleted successfully',
            data: lead
        })
    } catch (error) {
        console.error('Error deleting lead by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting lead by ID',
            error: error.message
        })
    }
}

export const convertLeadToCustomer = async (req, res) => {
    try {
        const lead = await leadService.convertLeadToCustomer(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'Lead converted to customer successfully',
            data: lead
        })
    } catch (error) {
        console.error('Error converting lead to customer:', error);
        return res.status(500).json({
            success: false,
            message: 'Error converting lead to customer',
            error: error.message
        })
    }
}


export const addActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { activity } = req.body;
        const lead = await leadService.addActivityToLead(id, activity);
        return res.status(200).json({
            success: true,
            message: 'Activity added to lead successfully',
            data: lead
        })
    } catch (error) {
        console.error('Error adding activity to lead:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding activity to lead',
            error: error.message
        })
    }
}

export const deleteActivity = async(req,res)=>{
    try{
        const { id } = req.params;
        const { activity } = req.body;

        const lead = await leadService.deleteActivityFromLead(id, activity);
        return res.status(200).json({
            success: true,
            message: 'Activity deleted from lead successfully',
            data: lead
        })
    } catch (error) {
        console.error('Error deleting activity from lead:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting activity from lead',
            error: error.message
        })
    }
}