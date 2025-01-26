const express = require('express')
require('dotenv').config()
const router = express.Router()
const { handleFileUpload } = require('../controllers/Cloudinary.controller')
const { getWorkoutsGroupByCategory, getOneDayExercise, getOneExercise } = require('../controllers/Workout.controller')
const FileUpload = require('../middlewares/multer')
const fs=require('fs')
router.get('/workouts', getWorkoutsGroupByCategory)
router.get('/workouts/:workoutId/day/:day', getOneDayExercise)
router.get('/exercise/:id', getOneExercise)
router.post('/upload',FileUpload, (req, res, next) => {
    const {secret, folder, workoutId} = req.body
    console.log(secret, folder, workoutId)
    if (req.body.secret === process.env.UPLOAD_SECRET) {
        next()
    } else {
        // console.info(req.body)
        fs.unlinkSync(req.file.path)
        console.error("Unauthorized Chigga detected!")
        return res.status(401).json({ message: "Unauthorized Chigga!" })
    }
}, handleFileUpload)

module.exports = router
