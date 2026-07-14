import mongoose from 'mongoose';

const leadStructure = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'lost'],
        default: 'new',
        required: true
    },
    source: {
        type: String,
        enum: ['website', 'referral', 'social media', 'other'],
        required: true
    },
    value: {
        type: Number,
    },
    assignedTo: {
        type: String,
        required: true
    },
    notes: {
        type: [String],
        default: []
    },
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    activities: {
        type: [String],
        default: []
    }

}


const leadSchema = new mongoose.Schema(leadStructure);

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;