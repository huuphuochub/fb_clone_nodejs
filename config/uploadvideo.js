const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: "dnjakwi6l",
  api_key: "344452889843524",
  api_secret: 'JoKdhbcjt54WJ-RmxaK_rtmRWF4'
});

// Cấu hình lưu trữ cho video
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['mp4', 'avi', 'mov', 'mkv'],
  params: {
    folder: 'test',
    resource_type: 'video', // Cần chỉ định để xử lý video
  }
});

const uploadVideo = multer({ storage });

module.exports = uploadVideo;
