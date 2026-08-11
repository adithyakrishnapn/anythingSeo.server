import UserSettings from '../models/UserSettings.js';
import { encrypt } from '../utils/encryption.js';

export const getSettings = async (req, res) => {
    try {
        const ownerId = req.ownerId;
        let settings = await UserSettings.findOne({ ownerId });
        
        if (!settings) {
            settings = await UserSettings.create({ ownerId });
        }

        return res.status(200).json({
            success: true,
            data: {
                email: {
                    configured: !!settings.email?.appPassword,
                    address: settings.email?.address || ""
                },
                ai: {
                    groqConfigured: !!settings.ai?.groqApiKey
                }
            }
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching settings',
            error: error.message
        });
    }
};

export const updateEmailConfig = async (req, res) => {
    try {
        const ownerId = req.ownerId;
        const { address, appPassword } = req.body;

        // Basic validations
        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Gmail address is required'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(address)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Gmail address format'
            });
        }

        let settings = await UserSettings.findOne({ ownerId });
        if (!settings) {
            settings = new UserSettings({ ownerId });
        }

        settings.email.address = address;
        
        // Only update appPassword if a new one is provided (do not overwrite with empty string)
        if (appPassword && appPassword.trim() !== '') {
            settings.email.appPassword = encrypt(appPassword.trim());
        }

        await settings.save();

        return res.status(200).json({
            success: true,
            message: 'Email configuration updated successfully',
            data: {
                email: {
                    configured: !!settings.email.appPassword,
                    address: settings.email.address
                }
            }
        });
    } catch (error) {
        console.error('Error updating email configuration:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating email configuration',
            error: error.message
        });
    }
};

export const updateAiConfig = async (req, res) => {
    try {
        const ownerId = req.ownerId;
        const { groqApiKey } = req.body;

        let settings = await UserSettings.findOne({ ownerId });
        if (!settings) {
            settings = new UserSettings({ ownerId });
        }

        // Only update key if a new one is provided
        if (groqApiKey && groqApiKey.trim() !== '') {
            settings.ai.groqApiKey = encrypt(groqApiKey.trim());
        } else if (groqApiKey === '') {
            return res.status(400).json({
                success: false,
                message: 'Groq API Key cannot be empty when updating'
            });
        }

        await settings.save();

        return res.status(200).json({
            success: true,
            message: 'AI configuration updated successfully',
            data: {
                ai: {
                    groqConfigured: !!settings.ai.groqApiKey
                }
            }
        });
    } catch (error) {
        console.error('Error updating AI configuration:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating AI configuration',
            error: error.message
        });
    }
};

export const deleteEmailConfig = async (req, res) => {
    try {
        const ownerId = req.ownerId;
        const settings = await UserSettings.findOne({ ownerId });

        if (settings) {
            settings.email.address = '';
            settings.email.appPassword = '';
            await settings.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Email configuration cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing email configuration:', error);
        return res.status(500).json({
            success: false,
            message: 'Error clearing email configuration',
            error: error.message
        });
    }
};

export const deleteAiConfig = async (req, res) => {
    try {
        const ownerId = req.ownerId;
        const settings = await UserSettings.findOne({ ownerId });

        if (settings) {
            settings.ai.groqApiKey = '';
            await settings.save();
        }

        return res.status(200).json({
            success: true,
            message: 'AI configuration cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing AI configuration:', error);
        return res.status(500).json({
            success: false,
            message: 'Error clearing AI configuration',
            error: error.message
        });
    }
};
