const protect = require('../middlewares/authMiddleware')
require('dotenv').config()
const { createUser,
    loginUser,
    getUserProfile,
    updateUser,
    updateWorkoutStatus,
    startWorkoutV2,
    getWorkoutProgress,
    workoutCompleteDayExercise,
    workoutCompleteDay,
    startWorkout } = require('../controllers/User.controller')
const FileUpload = require('../middlewares/multer')
const { handleProfileUpload } = require('../controllers/Cloudinary.controller')
const express = require('express')
const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', createUser)
router.post('/update', protect, updateUser)
router.post('/enroll', protect, startWorkoutV2)
router.post('/updateProgress', protect, updateWorkoutStatus)
router.get('/workouts/:id/progress', protect, getWorkoutProgress)
router.post('/workouts/:id/day/:n/exercise/:x/complete', protect, workoutCompleteDayExercise)
router.post('/workouts/:id/day/:n/complete', protect, workoutCompleteDay)
router.post('/upload', (req, res, next) => {
    if (req.body.secret === process.env.UPLOAD_SECRET) {
        next()
    } else {
        console.error("Unauthorized Chigga detected!")
        return res.status(401).json({ message: "Unauthorized Chigga!" })
    }
}, FileUpload, handleProfileUpload)
router.get('/info', protect,getUserProfile)

module.exports = router