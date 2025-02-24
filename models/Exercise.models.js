const mongoose = require('mongoose')
const { Schema } = mongoose

const ExerciseSchema = new Schema({
    name: { type: String, required: true },
    instructions: { type: String, required: true },
    tips: { type: String },
    imageUrl: { type: String, default: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F001%2F981%2F025%2Foriginal%2Fyoung-athletes-exercising-together-free-vector.jpg&f=1&nofb=1&ipt=1bd4930ecf0a6b3b4565823566c9d5947059630b53ea456d9adc7ba42bc9c011&ipo=images' },
    videoUrl: { type: String },
    focusArea: [{ type: String }],
    imageId: { type: String },
})


module.exports = mongoose.model('Exercise', ExerciseSchema)