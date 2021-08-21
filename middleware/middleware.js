const jwt =require('jsonwebtoken');
const User = require('../model/User');
const dotenv = require('dotenv');
dotenv.config({path:'../config/dotenv.env'})
let JWT_KEY = process.env.jwt_key;

const middleware = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,JWT_KEY);
        const user = await User.findOne({_id:verifyUser._id})
        req.token = token
        req.user = user
        next();
    } catch (error) {
        res.status(400).send('Invalid user')
    }
}

const loginmiddleware = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(token){
        const verifyUser = jwt.verify(token,JWT_KEY);
        const user = await User.findOne({_id:verifyUser._id})
        req.token = token
        req.user = user
        next();
        }else{
            next();
        }
    } catch (error) {
        res.status(400).send('Invalid user')
    }
}
module.exports = {
    middleware,
    loginmiddleware
}