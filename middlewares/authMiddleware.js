const jwt = require('jsonwebtoken')
const User = require('../models/User.models')
require('dotenv').config()

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log(req.body);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        let token = authHeader.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decode._id).select('-password')
        // console.log("ping")
        next()
        
    } catch (error) {
        console.error("Error in authMiddleware.js : protect() \n", error.message)
        console.log(req.body)
        console.log(req.headers)
        return res.status(401).json({
            message: "Unauthorized user"
        })

    }
}

module.exports =  protect 