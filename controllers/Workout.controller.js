require('dotenv').config()
const Workout = require('../models/Workout.models')
const Exercise = require('../models/Exercise.models')

const getWorkoutsGroupByCategory = async (req, res) => {
    try {
        const workouts = await Workout.find()
        let workoutsGroupByCategory = {}
        workouts.forEach(workout => {
            if (workoutsGroupByCategory[workout.type]) {
                workoutsGroupByCategory[workout.type].push(workout)
            } else {
                workoutsGroupByCategory[workout.type] = [workout]
            }
        })
        return res.status(200).json({
            message: "Workouts grouped by category",
            data: workoutsGroupByCategory
        })
        
    } catch (error) {
        console.error("Error in Workout.controller.js : getWorkoutsGroupByCategory() \n", error.message)
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }
}

const getOneDayExercise= async (req, res)=>{
    try {
        const workoutId=req.params.workoutId
        const day=req.params.day
        const workout=await Workout.findOne({ _id:workoutId, 'roadMap.day':2}, { 'roadMap.$': 1 })
        res.status(200).json({message:"Exercise found",data:workout})
    } catch (error) {
        console.error("Error in Workout.controller.js : getOneDayExercise() \n", error.message)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
const getOneExercise=async (req, res)=>{
    try {
        const id=req.params.id
        !(id) && res.status(400).json({message:"Id is required"})
        const exercise=await Exercise.findById(id)
        res.status(200).json({message:"Exercise found",data:exercise})
        
    } catch (error) {
        console.error("Error in Workout.controller.js : getOneExercise() \n", error.message)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}



module.exports={
    getWorkoutsGroupByCategory,
    getOneDayExercise,
    getOneExercise
}
