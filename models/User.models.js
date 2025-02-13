const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String, required: true, unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9_]*$/.test(v);
            },
            message: props => `${props.value} is not a valid username format!`
        }

    },
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    weight: { type: Number },
    height: { type: Number },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    sex: { type: String, lowercase: true },
    age: { type: Number },
    achivement:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Achivement',
                required: true
            }, {
                createdAt: {
                    type: Date, default: Date.now
                }
            }
        ]
    ,
    createdAt: { type: Date, default: Date.now },
    activeDays: [{ type: Date }],
    completedWorkouts: [{
        workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
        startedAt: { type: Date },
        endedAt: { type: Date, default: Date.now }
    }],
    inprogressWorkouts: [{
        workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
        startedAt: { type: Date, default: Date.now },
        lastDoneAt: { type: Date, default: Date.now },
        daysCompleted: { type: Number, default: 0 }
    }],
    profileUrl: {
        type: String,
        default: 'https://www.llt.at/wp-content/uploads/2021/11/blank-profile-picture-g77b5d6651-1280-705x705.png'
    }
})

module.exports = mongoose.model('User', userSchema)