const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const ChatSchema = new mongoose.Schema({
id_room:{
    type:String,
    // ref:'Roomchat',
    required:true,
},
id_user:{
    type:String,
    required:true,

},
content:{
    type:String,
    // required:true
},
image:{
    type:String,
    // required:true
},
date:{
    type:Date,
    default: Date.now,
    required:true,
},
username:{
    type:String,
    
},
avatar:{
    type:String
},
status:{
    type:Number,
    required:true
},
sendstatus:{
    type:Number,
    required:true,
}

}, { timestamps: true });

// Tạo model từ schema
const Chat = mongoose.model('chat', ChatSchema, 'chat');

// Xuất model để sử dụng trong các file khác
module.exports = Chat;
    