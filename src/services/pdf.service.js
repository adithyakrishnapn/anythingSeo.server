import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import PDF from "../models/pdf.model.js";
import { updatePdfPath } from "./summary.service.js";
import { uploadLocalFile } from "./cloudinary.service.js";
import env from "../config/env.js";

export const generatePDF = async (
    dataId,
    tag,
    fileName,
    directory,
    callback,
    ownerId = null
) => {
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const fullPath = path.join(
            directory,
            `${tag}-${fileName}.pdf`
        );

        const doc = new PDFDocument({
            margin: 50,
            size: "A4"
        });

        const stream = fs.createWriteStream(fullPath);

        doc.pipe(stream);

        callback(doc);

        doc.end();

        stream.on("finish", async () => {
            try {
                let finalPath = fullPath;

                // Check if Cloudinary is configured
                if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
                    try {
                        const uploadResult = await uploadLocalFile(fullPath, {
                            folder: "crm-pdfs",
                            resource_type: "auto"
                        });
                        finalPath = uploadResult.secure_url;

                        // Delete local file after successful upload
                        fs.unlink(fullPath, (err) => {
                            if (err) {
                                console.error("Failed to delete local temporary PDF file:", err);
                            }
                        });
                    } catch (uploadError) {
                        console.error("Cloudinary upload failed, falling back to local file path:", uploadError);
                    }
                }

                await updatePdfPath(dataId, finalPath, ownerId);
                resolve(finalPath);
            } catch (err) {
                reject(err);
            }
        });

        stream.on("error", reject);
    });
};
