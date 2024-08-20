const mongoose = require('mongoose');

// Định nghĩa schema cho DanhMuc
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username:{
    type:String,
    // required:true,
    unique:true,
  },
  normalizedUsername: { type: String }, // Thêm trường này

  password:{
    type:String,
    required:true,
  },
  phone:{
    type:Number,
    // require:true,
  },
  role:{
    type:Number,
    // required:true,
  },
  avatar:{
    type:String,
    // require:true
  },
  bannerimage:{
    type:String,
    // require:true,
  },
  image:{
    type:String,
    // require:true,
  },
  education:{
    type:String,
    // require:true,

  },
  address:{
    type:String,
    // require:true,
  },
  

  status:{
    type:Number,
    // require:true,
  }


}, { timestamps: true });

// Tạo model từ schema
const User = mongoose.model('user', UserSchema, 'user');

// Xuất model để sử dụng trong các file khác
module.exports = User;
    