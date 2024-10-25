const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Story = require('../model/story')
const uploadCloud = require('../config/cloud');
const uploadvideo = require('../config/uploadvideo')
const Viewstory = require('../model/viewstory')
const mongoose = require('mongoose');


require('dotenv').config();
const removeAccents = require('remove-accents');

router.post('/upstory', uploadvideo.single('video'), async(req,res) =>{
    const id_user = req.body.id_user;
    const linkvideo = req.file.path;
    const totalview = req.body.totalview;
    const status = req.body.status;

    try {
        const story = new Story({
            id_user:id_user,
            avatar:req.body.avatar,
            username:req.body.username,
            linkvideo:linkvideo,
            totalview:totalview,
            status:status
        })
        const add = story.save() 
        res.json(true)
    } catch (error) { 
        res.status(500).json(error)
    }
})
router.get('/getstorybyme/:id', async(req,res) =>{
    const id = req.params.id;  
    const hours =  new Date(Date.now() - 24 *60 *60 *1000);
    try {
        const story = await Story.find({
            id_user:id,
            date:{$gte:hours}
        })
        .sort({date:-1})
        .limit(1)
        res.json(story)
    } catch (error) {
        res.status(500).json(error)
    } 
})
router.post('/getstorybyariduser', uploadCloud.none(), async (req, res) => {
    try {
        const ids = req.body;
        // console.log(ids);

        // Tính toán thời điểm 24 giờ trước
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Truy vấn MongoDB với điều kiện thêm vào
        const users = await Story.find({
            status: 1,
            id_user: { $in: ids },
            date: { $gte: twentyFourHoursAgo } // Điều kiện để lọc các mục có ngày >= thời điểm 24 giờ trước
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/getallstorybyuser/:id', async(req,res) =>{
    const id = req.params.id;
    try {
        const storys = await Story.find({id_user:id})
        res.json(storys)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;
