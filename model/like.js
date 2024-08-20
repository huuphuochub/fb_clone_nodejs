const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const LikeSchema = new mongoose.Schema({
  id_user:{
    type:String,
    required:true,
  },
  id_post:{
    type:String,
    required:true,
  },
  type:{
    type:Number,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
    required:true
  }

}, { timestamps: true });

// Tạo model từ schema
const Like = mongoose.model('like', LikeSchema, 'like');

// Xuất model để sử dụng trong các file khác
module.exports = Like;
    