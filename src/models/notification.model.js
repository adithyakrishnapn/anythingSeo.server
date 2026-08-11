import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [
            "lead",
            "task",
            "system"
        ],
        default: "lead"
    },

    priority: {
        type: String,
        enum: [
            "Low",
            "Medium",
            "High"
        ],
        required: true
    },

    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead"
    },

    isRead: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model(
    "Notification",
    notificationSchema
);