require('dotenv').config()
const mongoose=require('mongoose')
async function dbConnect(){
    await mongoose.connect(process.env.MONGOOSE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>console.log('Connected to database'))
    .catch((err)=>console.log("Error in db config "+err))
}


module.exports=dbConnect