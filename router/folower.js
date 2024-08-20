const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Folower = require('../model/folower')
const uploadCloud = require('../config/cloud');
var nodemailer = require('nodemailer');
require('dotenv').config();
const removeAccents = require('remove-accents');


router.post('/addfolower', uploadCloud.none(), async(req,res) =>{
    console.log(req.body);
    try {
        const folower = new Folower({
            id_user1:req.body.id_user1,
            id_user2:req.body.id_user2,
            status:req.body.status,
        })
        const add = folower.save();
        res.json(true)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.get('/getfolowerbyuser/:id', async(req,res) =>{
    const id = req.params.id
    try {
        const folower = await Folower.find({
            $or:[
                {id_user1:id},
                {
                    id_user2:id
                }
            ]
        });
        res.json(folower);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
