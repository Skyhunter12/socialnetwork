const express = require("express");
const multer = require('multer');

const router = new express.Router();
const {body} = require('express-validator/check');
const { registerCntrl,
        loginCntrl,
        incircleFriendsCntrl,
        followCntrl,
        logoutCntrl} = require('../controller/authcontroller');
const { getAllMedia,
        postMedia,
        deleteMediaById,
        postLike,
        unlikeMedia,
        postComment,
        delComment,
        getMediaForUser} = require('../controller/mediacontroller');        
const {middleware,
    loginmiddleware} = require('../middleware/middleware');

let storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'./assets/media')
        },
        filename:(req,file,cb)=>{
            let date =Date.now()
            const filename = file.originalname.toLowerCase().split(' ').join('-').replace(/(\.[^\.]+)$/,date+'$1');
            console.log(filename);
            cb(null,filename)
        }
})
let upload = multer({
        storage:storage,
        limits:{
            fileSize:1024*1024*5
        },
        fileFilter:(req,file,cb)=>{
            if(file.mimetype == "image/png" ||
            file.mimetype =="image/jpg" ||
            file.mimetype =="image/jpeg" ||
             file.mimetype === 'video/gif'||
             file.mimetype === 'video/mp4'||
             file.mimetype === 'video/ogg'||
             file.mimetype === 'video/wmv'||
             file.mimetype === 'video/x-flv'||
             file.mimetype === 'video/avi'||
             file.mimetype === 'video/webm'||
             file.mimetype === 'video/mkv') {
            cb(null, true);
            }else{
                cb(null, false)
                return cb(new Error('only .png, .jpg/jpeg, .gif, .mp4, .ogg, .wmv, .x-flv, .avi, .webm, .mkv, .avchd, .mov  are allowed'));
            }
        }
});
    

router.post("/register",registerCntrl )
// login check
router.post("/login",loginmiddleware,loginCntrl)


router.post('/follow',middleware, followCntrl);

router.get("/incircle",middleware, incircleFriendsCntrl);

router.get("/allmedia",middleware ,getAllMedia);

router.get('/allmedia/user', middleware, getMediaForUser)

router.post('/media',[body('email','Please add correct URL').isEmail(),
    body('mediaTitle','Title Length should be 3 or more').isString().isLength({min:3}).trim(),
middleware,upload.single('mediaUrl')] ,postMedia)

router.delete("/media/:id",middleware,deleteMediaById)

router.put('/media/like/:id', middleware, postLike);

router.put('/media/unlike/:id', middleware, unlikeMedia);

router.post('/media/comment/:id',middleware,postComment);

router.delete('/media/comment/:id/:comment_id', middleware, delComment);

router.get('/logout',middleware, logoutCntrl)


module.exports = router;