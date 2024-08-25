const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Story = require('../model/story')
const uploadCloud = require('../config/cloud');
const uploadvideo = require('../config/uploadvideo')
const Viewstory = require('../model/viewstory')

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


module.exports = router;
