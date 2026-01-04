const mongoose = require('mongoose')
const { Schema } = mongoose
const WorkoutProgressSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    status: {
        type: String,
        enum: ["ENROLLED", "IN_PROGRESS", "COMPLETED", "NOT_ENROLLED"],
        default: "NOT_ENROLLED"
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    lastUpdatedAt: { type: Date, default: Date.now },
    highestUnlockedDay: { type: Number, default: 1 },
    days: [
        {
            dayNumber: { type: Number, required: true },
            status: {
                type: String,
                enum: ["COMPLETE", "INPROGRESS", "LOCKED"],
                default: "LOCKED"
            },
            completePercentage: { type: Number, default: 0 },
            totalExercises: { type: Number, default: 0 },
            completedExercises: { type: Number, default: 0 },
            completedAt: { type: Date },
            exercises: [
                {
                    exerciseNumber: { type: Number, required: true },
                    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
                    completed: { type: Boolean, default: false },
                    completedAt: { type: Date }
                }
            ]

        }
    ]
})
WorkoutProgressSchema.index({ user: 1, workoutId: 1 }, { unique: true });

module.exports = mongoose.model('WorkoutProgress', WorkoutProgressSchema);