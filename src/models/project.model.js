import mongoose from 'mongoose';

const expiry = new Date();
const expiryDate = expiry + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const projectSrtucture = {
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    clientName:{
        type: String,
        required: true,
    },
    ProjectName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
    },
    assignedTo: {
        type: String,
    },
    expiryDate: {
        type: Date,
        default: expiryDate,
    }
}

const projectSchema = new mongoose.Schema(projectSrtucture);

const ProjectModel = new mongoose.model("Project", projectSchema);

export default ProjectModel;