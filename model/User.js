const dotenv = require('dotenv')
let mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const geocoder = require('../common/geocoder')
const { getLocationType } = require('geolocation-utils');
dotenv.config({path:'../config/dotenv.env'})

const JWT_KEY = process.env.jwt_key
let userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    tokens:[
        {token:{
            type:String,
            required:true
        }}
    ],
    address:{
        type:String
    },
    location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index:'2dsphere'
        },
        city:String,
        formattedAddress:String,
        zipcode:String
    },
    friends: [{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }],
    followed: [{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }],
    requests:[{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({ _id: this._id }, JWT_KEY);
        this.tokens =await this.tokens.concat({token})
        await this.save();
        return token;
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
 }

 userSchema.pre("save", async function(next) { 
     if(this.isModified("password")){
         this.password = await bcrypt.hash(this.password, 10);
     
    //  if(this.isModified('')){
         const loc = await geocoder.geocode(this.address)
          this.location = {
             type: "Point",
             coordinates: [loc[0].longitude, loc[0].latitude],
             formattedAddress: loc[0].formattedAddress,
             zipcode: loc[0].zipcode
            };

      }
     next();
 })
userSchema.index({location:'2dsphere'})
 const User = new mongoose.model("User", userSchema);
 module.exports = User;