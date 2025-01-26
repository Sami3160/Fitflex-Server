const { uploadOnCloudinary, deleteOnCloudinary } = require('../utils/cloudinary.utils')
const Exercise = require('../models/Exercise.models')
const Workout = require('../models/Workout.models')
const User = require('../models/User.models')

const handleFileUpload = async (req, res) => {
    const doc = req.file
    const { folder } = req.body
    if (!doc || !folder) {
        return res.status(400).json({ message: "File/Folder not found in body" })
    }
    try {
        if (folder == "workout") {
            const { workoutId } = req.body
            const result = await uploadOnCloudinary(doc.path, folder)
            if (!result) {
                console.error("Error in Cloudinary.controller.js in handleUpload : \n Upload result not found")
                return res.status(500).json({ message: "Error in uploading file" })
            }
            const oldId=await Workout.findById(workoutId)
            if(oldId.imageId){
                console.log(oldId.imageId)
                await deleteOnCloudinary(oldId)
            }
            console.log(result)
            await Workout.findByIdAndUpdate(workoutId, { imageUrl: result.url, imageId: result.public_id })
        } else if (folder == "exercise") {
            const { exerciseId } = req.body
            const result = await uploadOnCloudinary(doc.path, folder)
            const oldId=await Exercise.findById(exerciseId).select("imageId")
            if(oldId){
                await deleteOnCloudinary(oldId)
            }
            await Exercise.findByIdAndUpdate(exerciseId, { imageUrl: result.url, imageId: result.public_id })
        } else {
            return res.status(400).json({ message: "Unknown folder name " + folder })
        }
        return res.status(200).json({ message: "File uploaded successfully" })
    } catch (error) {

        console.error("Error in Cloudinary.controller.js in handleUpload " + error.message)
        console.error(error)
        return res.status(500).json({ message: error.message })
    }
}

const handleProfileUpload = async (req, res) => {
    const doc = req.file
    const { userId } = req.body
    if (!doc || !userId) {
        return res.status(400).json({ message: "File/UserId not found in body" })
    }
    try {
        const result = await uploadOnCloudinary(doc.path, "profile")
        const oldId=await User.findById(userId).select("profileId")
        if(oldId){
            await deleteOnCloudinary(oldId)
        }
        await User.findByIdAndUpdate(userId, { profileUrl: result.url })
    } catch (error) {
        console.error("Errorn in Cloudinary.controller.js in handleProfileUpload() \n" + error.message)
        console.error(error)
        return res.status(500).json({ message: error.message })
    }
}

module.exports = { handleFileUpload, handleProfileUpload }