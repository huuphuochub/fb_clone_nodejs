const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const StorySchema = new mongoose.Schema({

    id_user:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true,
    },
    linkvideo:{
        type:String,
        required:true,
    },
    status:{
        type:Number,
        required:true,
    },
    date:{
        type: Date,
        default: Date.now(),
        required:true
    },
    totalview:{
        type:Number,
        required:true,
    }

}, { timestamps: true });

// Tạo model từ schema
const Story = mongoose.model('story', StorySchema, 'story');

// Xuất model để sử dụng trong các file khác
module.exports = Story;
    