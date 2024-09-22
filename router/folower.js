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


router.post('/addfolower', uploadCloud.none(), async (req, res) => {
    try {
        const { id_user1, id_user2, status } = req.body;
        
        // Check if a Folower document with either id_user1 or id_user2 matches id_user1
        const existingFolower = await Folower.findOne({
            $or: [
                { id_user1: id_user1, id_user2: id_user2 },
                { id_user1: id_user2, id_user2: id_user1 }
            ]
        });
        
        if (existingFolower) {
            // If found, update the status to 3
            existingFolower.status = 3;
            await existingFolower.save();
            res.json({ success: true, message: 'Status updated to 3.' });
        } else {
            // If not found, create a new Folower document
            const newFolower = new Folower({
                id_user1,
                id_user2,
                status
            });
            await newFolower.save();
            res.json({ success: true, message: 'New folower added.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
