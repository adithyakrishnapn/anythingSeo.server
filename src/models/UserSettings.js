import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    email: {
        provider: {
            type: String,
            default: 'gmail'
        },
        address: {
            type: String,
            trim: true,
            default: ''
        },
        appPassword: {
            type: String,
            default: '' // Stored as encrypted AES-256-GCM string
        }
    },
    ai: {
        groqApiKey: {
            type: String,
            default: '' // Stored as encrypted AES-256-GCM string
        }
    }
}, {
    timestamps: true
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

export default UserSettings;
