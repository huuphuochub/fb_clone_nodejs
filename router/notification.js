const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Notification = require('../model/notification')
const uploadCloud = require('../config/cloud');
var nodemailer = require('nodemailer');
require('dotenv').config();
const removeAccents = require('remove-accents');


router.post('/add', uploadCloud.none(), async(req,res) =>{
    console.log(req.body);
    try {
        const add = new Notification({
            id_user:req.body.id_user,
            content:req.body.content,
            id_post:req.body.id_post,
            type:req.body.type,
            status:0,
        })
        await add.save()
        res.json(true)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get('/getnotibyuser/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const noti = await Notification.find({ id_user: id })
            .sort({ date: -1 }) // Sắp xếp theo trường date theo thứ tự giảm dần
            .limit(20); // Giới hạn kết quả chỉ lấy 20 thông báo

        res.status(200).json(noti);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'An error occurred', error });
    }   
});
router.post('/update', uploadCloud.none(),async(req,res) =>{
    const id = req.body.id;
    console.log(typeof id);
    console.log(req.body)
    
    try {
        const update = await Notification.findByIdAndUpdate(id,{status:1},{new:true})
        res.json(true)
    } catch (error) {
        res.status(500).json(error) 
    }
})   
 
module.exports = router;
      