const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Like = require('../model/like');
const Post = require('../model/post')
const uploadCloud = require('../config/cloud');
// const User = require('../model/user')

require('dotenv').config();
const removeAccents = require('remove-accents');


router.post('/addlike', uploadCloud.none(), async(req,res )=>{
    // console.log(req.body);
    try {
        const islike = await Like.findOne({id_user:req.body.id_user ,id_post:req.body.id_post});
        if(islike){
          const updatelike = await Like.findByIdAndUpdate(islike._id,{
                type:req.body.type
          },{new:true});
          res.json(true)
        }else{
            const newlike = new Like({
                id_user:req.body.id_user,
                id_post:req.body.id_post,
                type:req.body.type,
            })
             await Post.findByIdAndUpdate(req.body.id_post,{$inc:{
                totallike:1
            }})
            const save = await newlike.save();
            res.json(true)
        }
       
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get('/getlikebypost/:id', async(req,res) =>{
    try {
        const like = await Like.find({id_post:req.params.id})
        .sort({date:-1})
        .limit(50);
        res.json(like)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.post('/getalllikeme', uploadCloud.none(), async(req,res) =>{
    const id_user = req.body.id_user;
    const id_post = req.body.id_post;
    // console.log(req.body)


    const likes = await Like.find({
        id_post: { $in: id_post }, 
        id_user: id_user           
    })
    .sort({date:-1})
    .limit(100)
        res.json(likes)



})
router.post('/deletelike', uploadCloud.none(), async(req,res) =>{
    // console.log(req.body);
    try {
        const deletelike = await Like.findOneAndDelete({id_post:req.body.id_post,id_user:req.body.id_user})
        if(deletelike){
            await Post.findByIdAndUpdate(req.body.id_post,{$inc:{
                totallike:-1
            }})
            res.json(true);
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;
