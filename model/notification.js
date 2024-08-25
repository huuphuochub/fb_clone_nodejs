const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const NotiSchema = new mongoose.Schema({
 id_user:{
    type:String,
    require:true
 },
 content:{
    type:String,
    required:true,
 },
 id_post:{
    type:String,
    
 },
 status:{
    type:Number,
    required:true
 },
 date:{
    type:Date,
    default:Date.now,
    required:true,
 },
 type:{
   type:String,
   required:true,
 }

}, { timestamps: true });

// Tạo model từ schema
const Notification = mongoose.model('notification', NotiSchema, 'notification');
 
// Xuất model để sử dụng trong các file khác
module.exports = Notification;
    