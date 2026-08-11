import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true
        },

        fileUrl: {
            type: String,
            required: true
        },

        fileType: {
            type: String,
            enum: [
                "image",
                "pdf",
                "document",
                "spreadsheet",
                "other"
            ]
        },

        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const commentSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const historySchema = new mongoose.Schema(
    {
        action: String,

        performedBy: {
            type: String,
            default: "System"
        },

        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const taskSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
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
        enum: ["Lead", "Client", "Project"]
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "In Progress",
            "On Hold",
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
            "High",
            "Critical"
        ],
        default: "Medium"
    },

    dueDate: {
        type: Date,
        required: true
    },

    completedAt: {
        type: Date,
        default: null
    },

    estimatedHours: {
        type: Number,
        default: 0
    },

    actualHours: {
        type: Number,
        default: 0
    },

    notes: [{
        type: String,
        trim: true
    }],

    comments: [commentSchema],

    attachments: [attachmentSchema],

    reminderAt: {
        type: Date,
        default: null
    },

    aiGenerated: {
        type: Boolean,
        default: false
    },

    history: [historySchema]

}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;