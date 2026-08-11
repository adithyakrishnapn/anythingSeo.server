import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/user.model.js';
import Lead from '../models/lead.model.js';
import Client from '../models/client.model.js';
import ProjectModel from '../models/project.model.js';
import Task from '../models/task.model.js';
import Summary from '../models/summary.model.js';
import PDF from '../models/pdf.model.js';
import Notification from '../models/notification.model.js';
import ClientAIAnalysis from '../models/ClientAIAnalysis.js';
import LeadAIAnalysis from '../models/LeadAIAnalysis.js';
import TaskAIAnalysis from '../models/TaskAIAnalysis.js';

const runMigration = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI not specified in environment variables.");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully.");

        // Find the first user in the database
        const firstUser = await User.findOne().sort({ createdAt: 1 });
        if (!firstUser) {
            console.warn("WARNING: No users found in the database. Please sign up a user first before running migrations.");
            mongoose.connection.close();
            return;
        }

        const defaultOwnerId = firstUser._id;
        console.log(`Migrating all orphaned records to User: ${firstUser.name} (${firstUser.email}) [ID: ${defaultOwnerId}]`);

        const modelsToMigrate = [
            { name: "Lead", model: Lead },
            { name: "Client", model: Client },
            { name: "Project", model: ProjectModel },
            { name: "Task", model: Task },
            { name: "Summary", model: Summary },
            { name: "PDF", model: PDF },
            { name: "Notification", model: Notification },
            { name: "ClientAIAnalysis", model: ClientAIAnalysis },
            { name: "LeadAIAnalysis", model: LeadAIAnalysis },
            { name: "TaskAIAnalysis", model: TaskAIAnalysis }
        ];

        for (const { name, model } of modelsToMigrate) {
            // Find records that don't have ownerId set
            const result = await model.updateMany(
                { ownerId: { $exists: false } },
                { $set: { ownerId: defaultOwnerId } }
            );
            console.log(`- ${name}: Updated ${result.modifiedCount} records (Matched: ${result.matchedCount}).`);
        }

        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        mongoose.connection.close();
    }
};

runMigration();
