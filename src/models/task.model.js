import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: "",
        trim: true
    },

    relatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "relatedModel"
    },

    relatedModel: {
        type: String,
        required: true,
        enum: ["Lead", "Client"]
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "In Progress",
            "Completed",
            "Cancelled"
        ],
        default: "Pending"
    },

    priority: {
        type: String,
        enum: [
            "Low",
            "Medium",
            "High"
        ],
        default: "Medium"
    },

    dueDate: {
        type: Date,
        required: true
    },

    createdBy: {
        type: String,
        default: "AI Agent"
    },

    completedAt: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


const Task = mongoose.model("Task", taskSchema);

export default Task;