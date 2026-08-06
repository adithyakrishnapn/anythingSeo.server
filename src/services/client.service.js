import Client from "../models/client.model.js";

export const createClient = async (clientData) => {
    return await Client.create(clientData);
}

export const updateClient = async (id, clientData) => {
    return await Client.findByIdAndUpdate(id, clientData,{returnDocument: "after"});
}

export const getClients = async () => {
    return await Client.find();
}


export const getClientById = async (id) => {
    return await Client.findById(id);
}

export const deleteClient = async (id) => {
    return await Client.findByIdAndDelete(id);
}

export const addActivityToClient = async (id, activity) => {
    return await Client.findByIdAndUpdate(id, { $push: { activities: activity } }, { returnDocument: "after" });
}

export const deleteActivityFromClient = async (id, activity) => {
    return await Client.findByIdAndUpdate(id, { $pull: { activities: activity } }, { returnDocument: "after" });
}