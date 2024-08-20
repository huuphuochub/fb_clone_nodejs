const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Comment = require('../model/comment')
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



module.exports = router;
