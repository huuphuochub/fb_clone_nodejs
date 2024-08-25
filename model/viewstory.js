const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const ViewstorySchema = new mongoose.Schema({

    id_story:{
        type:String,
        required:true,
    },
    id_user:{
        type:String,
        required:true,
    }


}, { timestamps: true });

// Tạo model từ schema
const Viewstory = mongoose.model('viewstory', ViewstorySchema, 'viewstory');

// Xuất model để sử dụng trong các file khác
module.exports = Viewstory;
    