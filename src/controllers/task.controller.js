import * as taskService from "../services/task.service.js";

/* ===========================
   CREATE TASK
=========================== */

export const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.ownerId);
        return res.status(201).json({
            success: true,
            message: "Task created successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   GET ALL TASKS
=========================== */

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks(req.ownerId);
        return res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   GET TASK
=========================== */

export const getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.ownerId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   UPDATE TASK
=========================== */

export const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(
            req.params.id,
            req.body,
            req.ownerId
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task updated successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   UPDATE STATUS
=========================== */

export const updateTaskStatus = async (req, res) => {
    try {
        const task = await taskService.updateTaskStatus(
            req.params.id,
            req.body.status,
            req.ownerId
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Status updated successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   ADD NOTE
=========================== */

export const addNote = async (req, res) => {
    try {
        const task = await taskService.addNote(
            req.params.id,
            req.body.note,
            req.ownerId
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Note added successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   REMOVE NOTE
=========================== */

export const removeNote = async (req, res) => {
    try {
        const task = await taskService.removeNote(
            req.params.id,
            req.params.noteIndex,
            req.ownerId
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Note removed successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   ADD COMMENT
=========================== */

export const addComment = async (req, res) => {
    try {
        const task = await taskService.addComment(
            req.params.id,
            req.body,
            req.ownerId
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Comment added successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   ADD ATTACHMENT
=========================== */

export const addAttachment = async (req, res) => {
    try {
        const task = await taskService.addAttachment(
            req.params.id,
            req.body,
            req.ownerId
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Attachment uploaded successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   REMOVE ATTACHMENT
=========================== */

export const removeAttachment = async (req, res) => {
    try {
        const task = await taskService.removeAttachment(
            req.params.id,
            req.params.attachmentId,
            req.ownerId
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Attachment removed successfully.",
            data: task
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   DELETE TASK
=========================== */

export const deleteTask = async (req, res) => {
    try {
        const task = await taskService.deleteTask(req.params.id, req.ownerId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   PENDING TASKS
=========================== */

export const getPendingTasks = async (req, res) => {
    try {
        const tasks = await taskService.getPendingTasks(req.ownerId);
        return res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   OVERDUE TASKS
=========================== */

export const getOverdueTasks = async (req, res) => {
    try {
        const tasks = await taskService.getOverdueTasks(req.ownerId);
        return res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* ===========================
   TODAY'S TASKS
=========================== */

export const getTasksDueToday = async (req, res) => {
    try {
        const tasks = await taskService.getTasksDueToday(req.ownerId);
        return res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ===========================
   TASK AI FOLLOWUP
=========================== */

export const sendTaskFollowUp = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await taskService.sendTaskFollowUpEmail(id, req.ownerId);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Task follow-up controller error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};