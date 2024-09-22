const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const FriendSchema = new mongoose.Schema({
 id_user1:{
    type:String,
    require:true
 },
 id_user2:{
    type:String,
    require:true,
 },
 status:{
    type:Number,
    require:true
 },
 lastPostTimeUser1:{
   type:Date,
   default:Date.now,
   required:true,
 },
 lastPostTimeUser2:{
   type:Date,
   default:Date.now,
   require:true,
 },
 date:{
   type:String,
 }

}, { timestamps: true });

// Tạo model từ schema
const Friend = mongoose.model('friend', FriendSchema, 'friend');

// Xuất model để sử dụng trong các file khác
module.exports = Friend;
    