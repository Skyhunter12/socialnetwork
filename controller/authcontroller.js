const User = require('../model/User');
const bcrypt = require('bcryptjs')

// post register @route /register
exports.registerCntrl = async (req, res) =>{
    try {
      const password = req.body.password;
      let success = false;
      if(password){
        const registerUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                address:req.body.address             
        })
        let token = await registerUser.generateAuthToken();
        res.cookie("jwt",token,{expires:new Date(Date.now() + 900000)})
        const registered = await registerUser.save();
        if(registered){
            success = true
            let respData = {
                'message':'User registered successfully',
                'success':success,
                'data':registered
            }
            return res.send(respData)
        }else{
            success = false;
            let respData = {
                'message':'Failed to register',
                'success':success,
                'data':`${registered.name} is failed in validation/s`
            }
            return res.send(respData);
        }
      }else{
          res.send("password is not valid")
      }
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}

// post login @route /login
exports.loginCntrl = async (req, res,next) =>{
    try {
        let success = false;
         const email = req.body.email;
         const password = req.body.password;
         const useremail = await User.findOne({email:email});
         const isMatch = await bcrypt.compare(password, useremail.password);
         let token; 
         if(!req.token){
         token = await useremail.generateAuthToken();
        }else{
            token = req.token;
        }
        res.cookie("jwt",token,{expires:new Date(Date.now()+900000)})
         if(isMatch){
             success=true
             let data={
                 'message':'Data verified successfully',
                 'success':success,
                 'Data':useremail
             };
           return res.status(200).send(data);
         }else{
             success=false
             let data={
                 'message':'Invalid credentials',
                 'success':success,
                 'Data':[]
             };
           return res.status(400).send(data); 
         }
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
 }

//  get incircle friends @route /incircle
 exports.incircleFriendsCntrl = async (req,res,next)=>{
     try {
         let success = false;
         if(!req.token){
             success = false
             res.status(400).json({
                 'message':'Invalid login credentials',
                 'success':success})
         }else{
            const longitude = req.user.location.coordinates[0];
            const latitude = req.user.location.coordinates[1];
            // maxDistance in meters
            let avilableConn = await User.find({location:{$near:{$geometry:{type:"Point",coordinates:[longitude,latitude]},$maxDistance:40000}}});
            success = true
            let respData = {
                'message':'User registered successfully',
                'success':success,
                'data':avilableConn
            }
            return res.send(respData)
         }
     } catch (error) {
         res.status(500).json({
             'message':'Network error',
             'errors':error
         })
     }
 }

// post follow @route /follow
exports.followCntrl =async (req,res,next)=>{
    try {
    if(!req.token){
        res.status(400).json({
            'message':'Not autherised user'
        })
    }  else{
        let email = req.body.target;
        User.findOne({email:email},(err,target)=>{
            if(err) res.send(err);
        if (target) {
            User.findOne({ email: req.user.email, followed: { $nin: [target._id] } }, (err, requestor) => {
                if (err) res.send(err);
                User.findByIdAndUpdate(requestor._id,
                    { "$push": { "followed": target._id } },
                    { "new": true, "upsert": true }, (err, user) => {
                        if (err)
                            res.send(err);
                    });
                 console.log(requestor);
                 console.log(target);   
                if( !requestor.requests.includes(target._id) && !target.requests.includes(requestor._id) 
                || requestor.requests.length ==0 || target.requests.length == 0){
                     User.findByIdAndUpdate(requestor._id,
                        { "$push": { "requests": target._id } },
                        { "new": true, "upsert": true }, (err, user_r) => {
                            if (err)
                                res.send(err);
                                console.log(user_r);
                        });
                        
                     User.findByIdAndUpdate(target._id,
                            { "$push": { "requests": requestor._id } },
                            { "new": true, "upsert": true }, (err, user) => {
                                if (err)
                                    res.send(err);
                                    console.log(user);
                    });    
                    res.status(200).json({
                        'message':`Friend request sent to ${target.email}`,
                        success: true });
                }else{
                    // if(requestor._id)
                    const removeIndexReq = requestor.requests.map(f_req=>f_req.toString()).indexOf(target._id);
                    requestor.requests.splice(removeIndexReq,1);
                    const removeIndexTrgt = target.requests.map(f_req=>f_req.toString()).indexOf(requestor._id);
                    target.requests.splice(removeIndexTrgt,1);
                    User.findByIdAndUpdate(requestor._id,
                        { "$push": { "friends": target._id } },
                        { "new": true, "upsert": true }, (err, user) => {
                            if (err)
                                res.send(err);
                        }); 
                    User.findByIdAndUpdate(target._id,
                        { "$push": { "friends": requestor._id } },
                        { "new": true, "upsert": true }, (err, user) => {
                            if (err)
                                res.send(err);
                    });
                res.status(200).json({
                    'message':`${target.email} is friend now add more friends`,
                    success: true });
                }
            });
        }
        else {
            res.status(404).send("The targeted user does not exist!")
        }
    })
}
} catch (error) {
    res.status(500).json({
        'message':'Network error. We are working on it',
        'errors':error})       
} 
}

// get logout @route /logout
exports.logoutCntrl = async(req,res)=>{
    try {
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save()
        res.send('Logged out successfully');
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}
