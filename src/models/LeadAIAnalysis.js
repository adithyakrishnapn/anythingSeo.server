import mongoose from 'mongoose';

const leadAIAnalysisStructure = {
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
        unique: true
    },

    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },

    risk: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },

    conversionChance: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    reason: {
        type: String,
        required: true,
        trim: true
    },

    recommendedAction: {
        type: String,
        required: true,
        trim: true
    },

    model: {
        type: String,
        default: "gpt-5.5"
    },

    generatedAt: {
        type: Date,
        default: Date.now
    },
    lastFollowupSent: {
        type: Date,
        default: null
    },
    followupCount: {
        type: Number,
        default: 0
    }
};

const leadAIAnalysisSchema = new mongoose.Schema(leadAIAnalysisStructure);

const LeadAIAnalysis = mongoose.model('LeadAIAnalysis', leadAIAnalysisSchema);

export default LeadAIAnalysis;