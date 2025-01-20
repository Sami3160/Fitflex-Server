const jwt=require('jsonwebtoken')
const User=require('../models/User.models')


const protect=async(req, res, next)=>{
    if(req.header.authorization && req.header.authorization.startsWith('Bearer')){
        let token;
        try{
            token=req.header.authorization.split(' ')[1]
            const decode=jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-password');
            
            next();
            return

        }catch(error){
            console.error("Error in authMiddleware.js : protect() \n", error)
            return res.status(401).send({
                message: 'Not authorized, token failed'
            })
        }
    }else{
        return res.status(401).send({
            message: 'Not authorized, no token'
        })
    }
}