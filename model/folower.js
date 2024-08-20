const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const FolowerSchema = new mongoose.Schema({
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
 date:{
   type:Date,
   default: Date.now(),
   required:true,
 }

}, { timestamps: true });

// Tạo model từ schema
const Folower = mongoose.model('folower', FolowerSchema, 'folower');

// Xuất model để sử dụng trong các file khác
module.exports = Folower;
    