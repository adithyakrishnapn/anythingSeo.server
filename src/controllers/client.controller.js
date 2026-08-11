import * as clientService from '../services/client.service.js';

export const createClient = async (req, res) => {
    try {
        const clientData = req.body;
        const client = await clientService.createClient(clientData, req.ownerId);
        res.status(201).json({ success: true, data: client, message: 'Client created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        const client = await clientService.updateClient(req.params.id, req.body, req.ownerId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: client, message: 'Client updated successfully' });
    } catch (error) {
        console.log("error updating client", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getClients = async (req, res) => {
    try {
        const clients = await clientService.getClients(req.ownerId);
        res.status(200).json({ success: true, data: clients, message: 'Clients fetched successfully' });
    } catch (error) {
        console.log("error fetching clients", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getClientById = async (req, res) => {
    try {
        const client = await clientService.getClientById(req.params.id, req.ownerId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: client, message: 'Client fetched successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const client = await clientService.deleteClient(req.params.id, req.ownerId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: client, message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addActivityToClient = async (req, res) => {
    try {
        const client = await clientService.addActivityToClient(req.params.id, req.body.activity, req.ownerId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: client, message: 'Activity added to client successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteActivityFromClient = async (req, res) => {
    try {
        const client = await clientService.deleteActivityFromClient(req.params.id, req.body.activity, req.ownerId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: client, message: 'Activity deleted from client successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getClientNameandId = async (req, res) => {
    try {
        const clients = await clientService.getClientNameandId(req.ownerId); 
        res.status(200).json({ success: true, data: clients, message: 'Client names and IDs fetched successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
