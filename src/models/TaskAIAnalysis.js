import mongoose from 'mongoose';

const taskAIAnalysisSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        required: true
    },
    reason: {
        type: [String],
        default: []
    },
    recommendedAction: {
        type: String,
        required: true,
        trim: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const TaskAIAnalysis = mongoose.model('TaskAIAnalysis', taskAIAnalysisSchema);

export default TaskAIAnalysis;
