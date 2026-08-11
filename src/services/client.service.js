import Client from "../models/client.model.js";

export const createClient = async (clientData, ownerId) => {
    return await Client.create({ ...clientData, ownerId });
};

export const updateClient = async (id, clientData, ownerId) => {
    return await Client.findOneAndUpdate(
        { _id: id, ownerId },
        clientData,
        { returnDocument: "after" }
    );
};

export const getClients = async (ownerId) => {
    return await Client.find({ ownerId });
};

export const getClientById = async (id, ownerId) => {
    return await Client.findOne({ _id: id, ownerId });
};

export const deleteClient = async (id, ownerId) => {
    return await Client.findOneAndDelete({ _id: id, ownerId });
};

export const addActivityToClient = async (id, activity, ownerId) => {
    return await Client.findOneAndUpdate(
        { _id: id, ownerId },
        { $push: { activities: activity } },
        { returnDocument: "after" }
    );
};

export const deleteActivityFromClient = async (id, activity, ownerId) => {
    return await Client.findOneAndUpdate(
        { _id: id, ownerId },
        { $pull: { activities: activity } },
        { returnDocument: "after" }
    );
};

export const getClientNameandId = async (ownerId) => {
    return await Client.find({ ownerId }, { _id: 1, name: 1 });
};