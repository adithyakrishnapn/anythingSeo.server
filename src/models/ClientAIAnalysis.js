import mongoose from 'mongoose';

const clientAIAnalysisSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
    health: {
        type: String,
        enum: ["Healthy", "At Risk", "Inactive", "Critical"],
        required: true
    },
    riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    risks: {
        type: [String],
        default: []
    },
    opportunities: {
        type: [String],
        default: []
    },
    recommendedActions: {
        type: [String],
        default: []
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    meetingSummary: {
        type: String,
        trim: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const ClientAIAnalysis = mongoose.model('ClientAIAnalysis', clientAIAnalysisSchema);

export default ClientAIAnalysis;
