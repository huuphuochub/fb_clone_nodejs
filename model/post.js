const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const PostSchema = new mongoose.Schema({
  id_user:{
    type:String,
    reuired:true,
  },
  image:{
    type:String,

  },
  content:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
    required:true,
  },
  status:{
    type:Number,
    required:true,
  },
  totallike:{
    type:Number,
    require:true,
  },
  totalcomment:{
    type:Number,
    required:true
  },
  totalshare:{
    type:Number,
    required:true,
  }

}, { timestamps: true });

// Tạo model từ schema
const Post = mongoose.model('post', PostSchema, 'post');

// Xuất model để sử dụng trong các file khác
module.exports = Post;
    