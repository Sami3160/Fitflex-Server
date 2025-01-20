const mongoose=require('mongoose')
const { Schema } = mongoose


const WorkoutSchema= new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    type:{type:String, required:true},
    categoryName:{type:String, required:true},
    duration:{type:Number, required:true},
    level:{
        type:String,
        enum:['Beginner','Intermediate','Advanced'],
        required:true
    },
    imageUrl:{type:String, required:true},
    moreInfoPath:{type:String},
})


module.exports=mongoose.model('Workout', WorkoutSchema)