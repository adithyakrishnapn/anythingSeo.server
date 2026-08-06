import * as clientService from '../services/client.service.js';

export const createClient = async (req, res) => {
    try {
        const clientData = req.body;
        const client = await clientService.createClient(clientData);
        res.status(201).json({ success: true, data: client, message: 'Client created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateClient = async (req, res) => {
    try {
        const client = await clientService.updateClient(req.params.id, req.body);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        res.status(200).json({ success: true, data: client, message: 'Client updated successfully' });
    } catch (error) {
        console.log("error updating client", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getClients = async (req, res) => {
    try {
        const clients = await clientService.getClients();
        res.status(200).json({ success: true, data: clients, message: 'Clients fetched successfully' });
    } catch (error) {
        console.log("error fetching clients", error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export const getClientById = async (req, res) => {
    try{
        const client = await clientService.getClientById(req.params.id);
        if(!client){
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        res.status(200).json({ success: true, data: client, message: 'Client fetched successfully' });
    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteClient = async (req, res) => {
    try {
        const client = await clientService.deleteClient(req.params.id);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        res.status(200).json({ success: true, data: client, message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addActivityToClient = async (req, res) => {
    try {
        const client = await clientService.addActivityToClient(req.params.id, req.body.activity);
        res.status(200).json({ success: true, data: client, message: 'Activity added to client successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteActivityFromClient = async (req, res) => {
    try {
        const client = await clientService.deleteActivityFromClient(req.params.id, req.body.activity);
        res.status(200).json({ success: true, data: client, message: 'Activity deleted from client successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}