const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Post = require('../model/post')
const uploadCloud = require('../config/cloud');
var nodemailer = require('nodemailer');
require('dotenv').config();
const removeAccents = require('remove-accents');


router.post('/addpost', uploadCloud.single('file'), async(req,res)=>{
    // console.log(req.body.status);
    const image = req.file ? req.file.path : req.body.file;
   console.log(req.body)
   try {
    const post = new Post({
        id_user:req.body.id_user,
        image:image,
        content:req.body.content,
        status:req.body.status,
        totallike:0,
        totalcomment:0,  
        totalshare:0,
    })
    const thanhcong = post.save()
    res.json(true)
   } catch (error) {    
        res.status(500).json(error)
   }
})
router.post('/getpostbyfriend', async(req,res) =>{
    const ids = req.body

    try {
        const posts = await Post.find({
            $and:[
                {id_user: {$in:ids}},
                {
                $or:[
                    {status:1},
                    {status:2}
                ]
            }
            ]
        })
        res.json(posts)
    } catch (error) {
        
    }
    
})
router.get('/getpostbyme/:id', async(req,res) =>{
    try {
        const post = await Post.find({id_user:req.params.id})
        res.json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/getpostbyfolowing', async(req,res) =>{
    const ids = req.body

    try {
        const posts = await Post.find({ 
            $and:[
                {id_user: {$in:ids}},
                {status:1 }
            ]
        })
        res.json(posts)
    } catch (error) {
        
    }
    
})
router.get('/getpostformidpost/:id',async(req,res) =>{
    const id = req.params.id
    try {
        const post = await Post.findById(id);
        res.json(post)
    } catch (error) {
        res.json(error);
    }
})


module.exports = router;
