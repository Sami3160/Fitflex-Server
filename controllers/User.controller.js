// Utility: Check if all days are completed and copy to completedWorkouts
async function checkAndCompleteWorkout(userId, workoutId) {
    const user = await User.findOne({ _id: userId, "inprogressWorkouts.workoutId": workoutId });
    if (!user) return;
    const inprogress = user.inprogressWorkouts.find(w => w.workoutId.toString() === workoutId.toString());
    if (!inprogress) return;

    // Get workout duration
    const workout = await WorkoutModels.findById(workoutId).select("duration");
    if (!workout) return;

    // Check all days completed
    const daysProgress = inprogress.daysProgress || {};
    const allCompleted = Object.values(daysProgress).length === workout.duration &&
        Object.values(daysProgress).every(day => day.completed === true);
    if (!allCompleted) return;

    // Check if already in completedWorkouts
    const alreadyCompleted = user.completedWorkouts.some(w => w.workoutId.toString() === workoutId.toString());
    if (alreadyCompleted) return;

    // Copy to completedWorkouts
    user.completedWorkouts.push({
        workoutId: inprogress.workoutId,
        startedAt: inprogress.startedAt,
        endedAt: Date.now(),
        daysProgress: inprogress.daysProgress
    });
    await user.save();
}
const User = require('../models/User.models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const WorkoutModels = require('../models/Workout.models')
const mongoose = require('mongoose')

const createUser = async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.confirmPassword) {
        return res.status(400).json({
            message: 'Please enter email and password'
        })
    }
    if (req.body.confirmPassword !== req.body.password) {
        return res.status(400).json({
            message: 'Passwords do not match'
        })
    }

    try {
        const emailExists = await User.findOne({ email: req.body.email })
        if (emailExists) {
            return res.status(400).json({
                message: 'Email already exists'
            })
        }
        const randomUserName = Math.random().toString(36).substring(7)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await new User({
            firstname: req.body.firstname.trim(),
            lastname: req.body.lastname.trim(),
            email: req.body.email.trim(),
            password: hashedPassword,
            username: req.body.firstname.trim() + "_" + randomUserName
        })
        const savedUser = await user.save()
        console.log(savedUser)
        savedUser.password = undefined
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "48h" })
        return res.status(201).json({ user: savedUser, token, message: 'User created successfully' })
    } catch (error) {
        console.error("Error in User.controller.js : createUser() \n", error)
        return res.status(500).json({
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    // console.log("request hit successfully", req)
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'Please enter email and password'
        })
    }
    try {
        const user = await User.findOne({ email: req.body.email.trim() })
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            })
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            })
        }
        user.password = undefined
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "48h" })
        return res.status(200).json({ user, token, message: 'User logged in successfully' })
    } catch (error) {
        console.error("Error in User.controller.js : loginUser() \n", error)
        return res.status(500).json({
            message: error.message
        })
    }
}
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


async function updateUser(req, res) {
    const userId = req.user._id;
    let updates = {
        'username': req.body.username || '',
        'firstName': req.body.firstName || '',
        'lastName': req.body.lastName || '',
        'email': req.body.email || '',
        'password': req.body.password || '',
        'weight': req.body.weight || '',
        'height': req.body.height || '',
        'blogs': req.body.blogs || '',
        'sex': req.body.sex || '',
        'age': req.body.age || ''
    };

    try {
        const allowedUpdates = ['username', 'firstName', 'lastName', 'email', 'password', 'weight', 'height', 'blogs', 'sex', 'age'];
        for (let key in updates) {
            // console.log(key);
            if (updates[key].length == 0) {
                delete updates[key];
            }
        }
        console.log(updates);
        console.log(req.body);
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }

        if (updates.password) updates.password = await bcrypt.hash(updates.password, 10)

        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in User.controller.js : updateUser() \n", error)
        return res.status(400).json(error);
    }
}

const startWorkout = async (req, res) => {
    const userId = req.user._id;
    const workoutId = req.body.workoutId;
    console.log(userId, workoutId);
    try {

        const workoutExists = await User.findOne({ _id: userId, 'inprogressWorkouts.workoutId': new mongoose.Types.ObjectId(workoutId) });
        if (workoutExists) {
            return res.status(400).json({ message: 'Workout already started!' });
        }
        const updateProgressWorkouts = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    inprogressWorkouts: {
                        workoutId: new mongoose.Types.ObjectId(workoutId),
                        lastDoneAt: Date.now(),
                        daysProgress: {}
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
        return res.status(200).json(updateProgressWorkouts);
    } catch (error) {
        console.error("Error in User.controller.js : startWorkout() \n", error)
        return res.status(500).json({ message: error.message });
    }
}

const updateWorkoutStatus = async (req, res) => {
    const userId = req.user._id;
    const { score = 100, workoutId, currentDay } = req.body;
  
    try {
      // 1. Find workout for duration (total days)
      const workout = await WorkoutModels.findById(workoutId).select("duration");
      if (!workout) {
        return res.status(404).json({ message: "Workout not found!" });
      }
  
      // 2. Find user's workout progress
      const userWorkout = await User.findOne(
        { _id: userId, "inprogressWorkouts.workoutId": workoutId },
        { "inprogressWorkouts.$": 1 }
      );
      if (!userWorkout || !userWorkout.inprogressWorkouts[0]) {
        return res
          .status(404)
          .json({ message: "Workout not found in progress for user!" });
      }
  
      const progress = userWorkout.inprogressWorkouts[0];
            const existingDay = progress.daysProgress[currentDay-1];
            const isCompleted = score >= 70;
            const newDayProgress = {
                score,
                completed: isCompleted,
                completedAt: Date.now(),
            };

            // 4. Build update object
            const updateFields = {
                $set: {
                    "inprogressWorkouts.$.lastDoneAt": Date.now(),
                    [`inprogressWorkouts.$.daysProgress.${currentDay}`]: newDayProgress,
                },
            };
  
      // 6. Apply update
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, "inprogressWorkouts.workoutId": workoutId },
        updateFields,
        { new: true }
      );
  
      const updatedWorkout = updatedUser.inprogressWorkouts.find(
        (w) => w.workoutId.toString() === workoutId.toString()
      );

  
            // 7. Return response (no daysCompleted logic)
            // Check and copy to completedWorkouts if all days are completed
            await checkAndCompleteWorkout(userId, workoutId);

            return res.status(200).json({
                message: isCompleted
                    ? "Day progress saved (completed)"
                    : "Day progress saved (not completed)",
                dayCompleted: isCompleted,
                currentDay,
                score,
                progress: updatedWorkout,
            });
    } catch (error) {
      console.error("Error in updateWorkoutStatus:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  



module.exports = {
    createUser,
    loginUser,
    getUserProfile,
    updateUser,
    updateWorkoutStatus,
    startWorkout
}