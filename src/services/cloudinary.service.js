import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a local file to Cloudinary.
 * @param {string} filePath - Path to the local file
 * @param {object} options - Cloudinary upload options (e.g. folder, resource_type)
 * @returns {Promise<object>} - Upload result
 */
export const uploadLocalFile = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            ...options
        });
        return result;
    } catch (error) {
        console.error("Cloudinary uploadLocalFile error:", error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

/**
 * Uploads a file buffer to Cloudinary using streams.
 * @param {Buffer} buffer - File buffer
 * @param {object} options - Cloudinary upload options
 * @returns {Promise<object>} - Upload result
 */
export const uploadBuffer = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", ...options },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary uploadBuffer error:", error);
                    return reject(new Error(`Cloudinary buffer upload failed: ${error.message}`));
                }
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Deletes an asset from Cloudinary using its public ID.
 * @param {string} publicId - The public ID of the asset
 * @param {object} options - Cloudinary destroy options
 * @returns {Promise<object>} - Deletion result
 */
export const deleteFile = async (publicId, options = {}) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, options);
        return result;
    } catch (error) {
        console.error("Cloudinary deleteFile error:", error);
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
};
