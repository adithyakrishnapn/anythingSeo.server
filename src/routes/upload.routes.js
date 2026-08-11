import { Router } from "express";
import multer from "multer";
import * as uploadController from "../controllers/upload.controller.js";

const router = Router();

// Configure multer to store uploaded files in memory buffers
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Limit files to 10MB
    }
});

// Single file upload route - expects field name 'file'
router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
