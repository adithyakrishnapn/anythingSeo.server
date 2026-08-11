import ProjectModel from "../models/project.model.js";

export const createProject = async(ProjectData, ownerId)=>{
    return await ProjectModel.create({ ...ProjectData, ownerId });
}

export const getProjects = async(ownerId)=>{
    return await ProjectModel.find({ ownerId }).sort({ createdAt: -1 });
}

export const getProjectById = async(id, ownerId)=>{
    return await ProjectModel.findOne({ _id: id, ownerId });
}

export const updateProject = async(id, ProjectData, ownerId)=>{
    return await ProjectModel.findOneAndUpdate(
        { _id: id, ownerId }, 
        ProjectData, 
        { returnDocument: "after" }
    );
}

export const deleteProject = async(id, ownerId)=>{
    return await ProjectModel.findOneAndDelete({ _id: id, ownerId });
}

export const changeStatus = async(id, status, ownerId)=>{
    return await ProjectModel.findOneAndUpdate(
        { _id: id, ownerId }, 
        { status }, 
        { returnDocument: "after" }
    );
}

export const getProjectsByClientId = async(clientId, ownerId)=>{
    return await ProjectModel.find({ clientId, ownerId }).sort({ createdAt: -1 });
}