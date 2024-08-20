const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: "dnjakwi6l",
  api_key: "344452889843524",
  api_secret: 'JoKdhbcjt54WJ-RmxaK_rtmRWF4'
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params:{ 
    folder:'test'
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
