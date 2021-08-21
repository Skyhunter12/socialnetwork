const url = require('url');
const fs = require('fs')
const path = require('path');
const User = require('../model/User');
const Post = require('../model/MediaModel');

// get all media files @route /allmedia
exports.getAllMedia = (req, res, next) => {
    if(!req.token){
        res.status(400).json({
            'message':'Invalid credentials Please login to get details'
        })
    }else{

    Post.find()
      .then(media => {
        res.status(200).send({
          'message':'Retrieved successfully',
          'media':media
        
        })
      })
      .catch(err =>  res.status(500).json({
        'message':'Network error. We are working on it',
        'errors':err}));

    };
}
// post media @route /media
 exports.postMedia = async (req,res,next)=>{
    try {
        // const email = req.body.email;
        let url = req.protocol+'://'+req.get('host');
        const mediaFile = req.file.filename;
        const user = await User.findById(req.user._id).select('-password');
        const newPost = new Post({
            user:req.user._id,
            email:user.email,
            mediaTitle:req.body.mediaTitle,
            mediaUrl:url+'/assets/media/'+req.file.filename
        });    
       await newPost.save().then(result=>{

            res.status(201).json({
                message:"User image saved successfully",
                userCreated:{
                    user:result.user,
                    mediaTitle:req.body.mediaTitle,
                    mediaUrl:result.mediaUrl
                }
            })
        }).catch(err=>
            res.status(400).json({
                'message':'New image seems to contain error',
                'errors':err
            }));

}catch(err){
    res.status(500).json({
        'message':'Network error. We are working on it',
        'errors':error})
}
}

// getMediaForUser ascending order as per date @route /allMedia/user
exports.getMediaForUser = async(req,res,next)=>{
    try {
        if(!req.token){
            res.status(400).send('Invalid credentials.Please login with valid creadentials')
        }else{
            console.log(req.user.friends);
            let friendsPost = await Post.find({user:{$in:req.user.friends}}).sort({date:-1})
            console.log(friendsPost);
            // let friend_user = await User.find({});
            if(friendsPost.length == 0){
                return res.status(400).json({'msg':'Not a friend Start adding to circle'})
            }else{
                return res.status(200).json({
                    'message':'Friends posts are loaded take a look',
                    'data':friendsPost
                })
            }

        }
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}


//   delete media @route /media/:id
exports.deleteMediaById = async (req,res,next)=>{
  try {
      let success = false; 
      if(!req.token){
      return res.status(400).send({
          'message':'Not a valid user',
          'success':success
      })
      }else{
      let mediaErase = await Post.findById(req.params.id);
      let pathname = new URL(mediaErase.mediaUrl).pathname;
      if(mediaErase.user.toString()==req.user._id){
      success = true;
      fs.unlinkSync(path.join(__dirname,'..',`${pathname}`));
      res.status(200).send({
          'message':`Image deleted for user with id ${req.user._id}`,
          'success':success
      })
      await mediaErase.remove();
      }else{
          success = false;
          return res.status(400).send({
              'message':`The ${req.user._id} is not authenticated to delete this image`,
              'success':success
          })   
          }
      }
  } catch (error) {
    res.status(500).json({
        'message':'Network error. We are working on it',
        'errors':error})
  }
}  


 
//  like a post @route put media/like/:id
exports.postLike = async (req,res,next)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length > 0){
            return res.status(400).json({msg:'Image already liked'})
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes)
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}

// like a post @route put media/unlike/:id

exports.unlikeMedia = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length == 0){
            return res.status(400).json({msg:'Post is yet not liked'})
        }
        const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        
        res.json(post.likes)
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}

//  post @route /images/comments/:id
exports.postComment = async(req,res,next)=>{
    try {
      const user = await User.findById(req.user.id).select('-password');
     const post = await Post.findById(req.params.id);  
     const newComment = {
         text:req.body.text,
         name:user.name,
         user:req.user.id
     } 
     post.comments.unshift(newComment);
     await post.save()
      res.json(post)      
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error})
    }
}

//delete  @route media/comment/:id/:comment_id
exports.delComment = async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if(!comment){
            return res.status(400).json({msg:'Comment doesn\'t exist'})
        }
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User is not autherised'})
        }
        const removeIndex = post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);
        await post.save();
        res.json(post.comments)
    } catch (error) {
        res.status(500).json({
            'message':'Network error. We are working on it',
            'errors':error});
    }
}

