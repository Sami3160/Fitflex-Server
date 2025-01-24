const  protect  = require('../middlewares/authMiddleware')
const { createUser,
    loginUser,
    getUserProfile,
    updateUser,
    updateWorkoutStatus,
    startWorkout } = require('../controllers/User.controller')

const express = require('express')
const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', createUser)
router.post('/update', protect, updateUser)
router.post('/enroll', protect, startWorkout)
router.post('/updateProgress', protect, updateWorkoutStatus)
router.get('/info', protect, getUserProfile)

module.exports = router