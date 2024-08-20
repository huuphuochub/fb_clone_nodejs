const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const RoomchatSchema = new mongoose.Schema({
    id_user:[
        {
            type:String,
            required:true,
        }
    ],
    type:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        
    },
    date:{
        type:Date,
        default:Date.now,
        required:true,
    },
    lastmess:{
        type:String,
        
    },lastuser:{
        type:String,
    }

}, { timestamps: true });

// Tạo model từ schema
const Roomchat = mongoose.model('room', RoomchatSchema, 'room');

// Xuất model để sử dụng trong các file khác
module.exports = Roomchat;
    