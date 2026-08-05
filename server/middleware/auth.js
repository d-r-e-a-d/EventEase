const jwt = require('jsonwebtoken');
const User = require('../models/User');
//user authentication middleware to protect routes
const protect = async (req, res, next) => {
    let token=req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if(token){
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select('-password');
            next();
        }catch(error){
            res.status(401).json({message:'Unauthorized',error:error.message});
        }
    }
    else{
        res.status(401).json({message:'No token, authorization denied'});
    }   
};
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({message:'Access denied, admin only'});
    }
};
module.exports = { protect, admin };