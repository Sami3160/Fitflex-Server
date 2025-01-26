const mongoose = require('mongoose')
const { Schema } = mongoose


const WorkoutSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    categoryName: { type: String, required: true },
    duration: { type: Number, required: true },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    imageUrl: { type: String, default: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F001%2F981%2F025%2Foriginal%2Fyoung-athletes-exercising-together-free-vector.jpg&f=1&nofb=1&ipt=1bd4930ecf0a6b3b4565823566c9d5947059630b53ea456d9adc7ba42bc9c011&ipo=images' },
    moreInfoPath: { type: String },
    roadMap: [
        {
            day: { type: Number, required: true },
            title: { type: String, required: true },
            exercises: [
                {
                    name: { type: String, required: true },
                    exerciseData: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
                    duration: { type: String, required: true },
                }
            ],
            duration: { type: Number }
        }
    ]
})


module.exports = mongoose.model('Workout', WorkoutSchema)