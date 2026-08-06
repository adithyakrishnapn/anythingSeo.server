import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import PDF from "../models/pdf.model.js";
import { updatePdfPath } from "./summary.service.js";

export const generatePDF = async (
    dataId,
    tag,
    fileName,
    directory,
    callback
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
                await updatePdfPath(dataId, fullPath);
                resolve(fullPath);
            } catch (err) {
                reject(err);
            }
        });

        stream.on("error", reject);
    });
};
