const mongoose = require('mongoose')
const { Schema } = mongoose


const AchivementsSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    usersOwning:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
})


module.exports=mongoose.exports('Achivements', AchivementsSchema)