const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (localpath, folderName) => {
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(localpath, {
            folder: folderName
        });

        return uploadResult;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error; // Propagate the error to the caller
    }
};

module.exports = uploadFile;
