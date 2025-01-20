const mongoose = require('mongoose')


const { Schema } = mongoose

const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Comment', commentSchema)