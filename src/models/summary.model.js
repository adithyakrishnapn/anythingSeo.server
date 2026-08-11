import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    summaryDate: {
        type: Date,
        required: true,
    },

    totalLeads: {
        type: Number,
        required: true,
        default: 0
    },

    newLeads: {
        type: Number,
        required: true,
        default: 0
    },

    highPriorityLeads: {
        type: Number,
        required: true,
        default: 0
    },

    convertedLeads: {
        type: Number,
        required: true,
        default: 0
    },

    lostLeads: {
        type: Number,
        required: true,
        default: 0
    },

    followupEmailsSent: {
        type: Number,
        required: true,
        default: 0
    },

    tasksCreated: {
        type: Number,
        required: true,
        default: 0
    },

    overdueTasks: {
        type: Number,
        required: true,
        default: 0
    },

    pdfPath:{
        type: String,
        default: ""
    },

    summary: {
        type: String,
        required: true,
        trim: true
    },

    highlights: {
        type: [String],
        default: []
    },

    risks: {
        type: [String],
        default: []
    },

    recommendations: {
        type: [String],
        default: []
    },

    generatedBy: {
        type: String,
        default: "AI Agent"
    }

}, {
    timestamps: true
});

const Summary = mongoose.model("Summary", summarySchema);

export default Summary;