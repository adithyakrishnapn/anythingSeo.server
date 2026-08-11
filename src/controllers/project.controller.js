import * as ProjectService from "../services/project.service.js";

export const createProjectController = async (req, res) => {
    try {
        const projectData = req.body;
        const project = await ProjectService.createProject(projectData, req.ownerId);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error("Project Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }  
};

export const getProjectsController = async (req, res) => {
    try {
        const projects = await ProjectService.getProjects(req.ownerId);
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("Project Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjectByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await ProjectService.getProjectById(id, req.ownerId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.log("Project Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProjectByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const projectData = req.body;
        const project = await ProjectService.updateProject(id, projectData, req.ownerId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Project Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProjectByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await ProjectService.deleteProject(id, req.ownerId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.log("Couldnt delete project", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changeProjectStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const project = await ProjectService.changeStatus(id, status, req.ownerId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Project Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjectsByClientIdController = async (req, res) => {
    try {
        const { clientId } = req.params;
        const projects = await ProjectService.getProjectsByClientId(clientId, req.ownerId);
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("Project Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
