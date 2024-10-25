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
//    console.log(req.body)
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
router.get('/getallpostbyuser/:id', async(req,res) =>{
    const id = req.params.id;
    console.log(id);
    
    try {
        const posts = await Post.find({id_user:id})
        res.json(posts)
    } catch (error) {
        res.status(500).json(false)
    }
})
router.post('/getpostbyfriend', async(req,res) =>{
    const ids = req.body
    console.log(ids)

    try {
        const posts = await Post.aggregate([
            {
                $match: {
                    id_user: { $in: ids },
                    $or: [
                        { status: 1 },
                        { status: 2 }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 } // Sắp xếp theo thời gian tạo bài post, giả sử có trường createdAt
            },
            {
                $group: {
                    _id: "$id_user", // Nhóm theo ID người dùng
                    latestPost: { $first: "$$ROOT" } // Lấy bài post mới nhất
                }
            },
            {
                $replaceRoot: { newRoot: "$latestPost" } // Thay thế root để lấy cấu trúc bài post
            }
        ]);
    
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
    
})
router.post('/getpagepostbyfriend', async (req, res) => {
    const ids = req.body.id;
    const page = req.body.page || 1; // Mặc định là trang 1
    const pageSize = 1; // Chỉ lấy 1 bài post cho mỗi ID

    try {
        const posts = await Post.aggregate([
            {
                $match: {
                    id_user: { $in: ids },
                    $or: [
                        { status: 1 },
                        { status: 2 }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 } // Sắp xếp theo thời gian tạo bài post
            },
            {
                $group: {
                    _id: "$id_user", // Nhóm theo ID người dùng
                    posts: { $push: "$$ROOT" } // Lưu tất cả bài post của người dùng vào mảng
                }
            },
            {
                $project: {
                    user_id: "$_id",
                    post: { $arrayElemAt: ["$posts", (page - 1) * pageSize] } // Lấy bài post theo trang
                }
            },
            {
                $match: { post: { $ne: null } } // Chỉ lấy những tài liệu có bài post
            },
            {
                $replaceRoot: { newRoot: "$post" } // Thay thế root để lấy bài post
            }
        ]);

        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
});

router.get('/getpostbyme/:id', async(req,res) =>{
    try {
        const post = await Post.find({id_user:req.params.id})
        res.json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get('/getpostbyid/:id', async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id)
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
