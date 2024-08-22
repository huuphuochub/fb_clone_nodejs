const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Comment = require('../model/comment')
const Post = require('../model/post')
const uploadCloud = require('../config/cloud');
var nodemailer = require('nodemailer');
require('dotenv').config();
const removeAccents = require('remove-accents');

router.get('/getcommentbypost/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const comments = await Comment.find({ id_post: id })
            .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần (-1)
            .limit(20);          // Giới hạn kết quả chỉ lấy 20 bình luận

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching comments.' });
    }
}); 
router.post('/addcmt', uploadCloud.none(), async(req,res) =>{ 
   try {
    const add = new Comment({ 
        id_user:req.body.id_user, 
        id_post:req.body.id_post, 
        content:req.body.content 
    })
    const adds =await add.save()
    await Post.findByIdAndUpdate(req.body.id_post,{$inc:{
        totalcomment:1
    }})
 
    res.json(true);
   } catch (error) {
    res.status(500).json(error)
   }
})



module.exports = router; 
 