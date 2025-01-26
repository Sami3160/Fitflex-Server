const cloudinary = require('../config/cloudinary.config')
const fs=require('fs')
const uploadOnCloudinary = async (localFilePath, folder) => {
    try {
        let response;
        if (!localFilePath) return null;
        if (folder === "workout") {
            response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder,
                transformation: [{ width: 700, height: 400, crop: "fill" }],
            });
        }else if(folder==="exercise"){
            response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder,
                transformation: [{ width: 700, height: 550, crop: "fill" }],
            });
        }else {
            response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
                folder,
                transformation: [{ width: 400, height: 400, crop: "fill" }],
            });
        }
        console.log("Uploaded to cloudinary:", response);
        fs.unlinkSync(localFilePath);
        return {
            public_id: response.public_id,
            url: response.url,
        };
    } catch (error) {
        console.error("Error in cloudinary.utils.js uploadOnCloudinary(localFilePath, folder) : \n",error.message);
        console.error(error);

        fs.unlinkSync(localFilePath);
        return null;
    }
}

async function deleteOnCloudinary(public_id) {
    try {
        console.log("Deleting resource with public_id:", public_id);
        const response = await cloudinary.api.delete_resources([public_id]);
        console.log(response);
    } catch (error) {
        console.error("Error in cloudinary.utils.js deleteOnCloudinary(public_id) : ",error.message);
        console.error("Error deleting resource:", error);
    }
}

module.exports = { uploadOnCloudinary, deleteOnCloudinary };