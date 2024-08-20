const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const CommentSchema = new mongoose.Schema({

    id_user:{
        type:String,
        required:true,
    },
    id_post:{
        type:String,
        required:true
    },
    image:{
        type:String,
        
    },
    content:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true,
    }

}, { timestamps: true });

// Tạo model từ schema
const Comment = mongoose.model('comment', CommentSchema, 'comment');

// Xuất model để sử dụng trong các file khác
module.exports = Comment;
    