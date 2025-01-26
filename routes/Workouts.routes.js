const express=require('express')
const router=express.Router()

const {getWorkoutsGroupByCategory,getOneDayExercise,getOneExercise}=require('../controllers/Workout.controller')

router.get('/workouts',getWorkoutsGroupByCategory)
router.get('/workouts/:workoutId/day/:day',getOneDayExercise)
router.get('/exercise/:id',getOneExercise)

module.exports=router
