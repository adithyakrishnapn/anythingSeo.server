import { uploadBuffer } from '../services/cloudinary.service.js';

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Determine the upload options (like custom folder)
        const options = {
            folder: "crm-uploads"
        };

        // If it's a PDF, raw doc, or spreadsheet, raw resource type might be required or auto will handle it
        const result = await uploadBuffer(req.file.buffer, options);

        // Map mime type to task schema attachment fileType
        let fileType = "other";
        const mime = req.file.mimetype;
        if (mime.startsWith("image/")) {
            fileType = "image";
        } else if (mime === "application/pdf") {
            fileType = "pdf";
        } else if (
            mime === "application/msword" ||
            mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mime === "text/plain"
        ) {
            fileType = "document";
        } else if (
            mime === "application/vnd.ms-excel" ||
            mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            mime === "text/csv"
        ) {
            fileType = "spreadsheet";
        }

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully to Cloudinary.",
            data: {
                fileName: req.file.originalname,
                fileUrl: result.secure_url,
                publicId: result.public_id,
                fileType: fileType,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error("Upload controller error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to upload file."
        });
    }
};
