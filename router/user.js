const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const User = require('../model/user')
const uploadCloud = require('../config/cloud');
var nodemailer = require('nodemailer');
require('dotenv').config();
const removeAccents = require('remove-accents');
const mongoose = require('mongoose');







var maotp;

function taoma(){  
  maotp = Math.floor(100000 + Math.random() * 900000);
}

router.post('/getalluserbyarrid', async(req, res) => {
  const ids = req.body;
  // console.log('ar id_user');
  // console.log(ids)
  const ok = ids.toString().split(',').map(id => new mongoose.Types.ObjectId(id.trim())); // Sử dụng 'new'
  // console.log('Mảng ID user cần lấy: ', ok);
  const users = await User.find({
    status: 1,  
    _id: { $in: ok } 
  });

  res.json(users);   
}); 





 
router.post('/checkemail', uploadCloud.none(), async(req,res) =>{
    // const username = req.body.username;
    const email  = req.body.email;
    // console.log(email)
    // const Users = await User.findOne({ username: username });
    const Email = await User.findOne({ email: email });
    // console.log("đã tồn tại" +Email)

     if(Email){ 
        res.json({thongbao:false});
    }else{
        res.json({thongbao:true});
    }
})
 
router.get('/:id', async(req,res) =>{
  // console.log('êh đc nè')
  try {
      const user = await User.findById(req.params.id, req.body)
      res.json(user);
      // console.log(user)
  } catch (error) {

      res.status(400).json(false);
  }
})

router.post('/xacthuc',uploadCloud.none(), async(req,res) =>{
    let email =req.body.email;
    
    // console.log(req.body.email);
    taoma();
    
    // console.log(email, maotp)
    
      
        if (!email) throw new Error('k có eamail')
      
        var transporter =  nodemailer.createTransport({ // config mail server
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'huuphuoc532004@gmail.com', //Tài khoản gmail vừa tạo
              pass: process.env.passem //Mật khẩu tài khoản gmail vừa tạo
          },
          tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false
          }
      });
    
        // mailOption là những thông tin gửi từ phía client lên thông qua API
        const mainOptions = {
          to: email, // Gửi đến ai?
          subject: `mã xác thực phở bò`, // Tiêu đề email
          html: `<h3>${maotp}</h3>` // Nội dung email
        }
        // Gọi hành động gửi email
        await transporter.sendMail(mainOptions, function(err, info){
          if (err) {
            return res.status(500).send(err.toString());
          } else {
            res.status(200).send('Email đã được gửi: ' + info.response);
          }
      });
    
    
    })


    router.post('/checkma',uploadCloud.none(), function(req,res, next){
        // console.log(req.body);
        var ma = parseInt(req.body.otp);
        // console.log(req.body.otp);
        // console.log(ma, maotp);
        if(maotp == ma){
          res.json({ketqua : true})
        }
        else{
          res.json({ketqua : false});
        }
      })


      router.post('/dangky', uploadCloud.none(), async(req,res) =>{
        // console.log(req.body.email);
        // console.log(req.body.password)
        const salt = await bcrypt.genSalt(10);
    
        const passwords = await bcrypt.hash(req.body.password, salt);
        try {
            const user = new User({
                // username:req.body.username,
                email:req.body.email,
                password:passwords,
                status:req.body.status,
                role:0
            })
            const luu = await user.save();
            // console.log(luu)
            res.json(true);
        } catch (error) {
            res.json({thongbao:error});
        }
    })


    router.post('/setprofile',uploadCloud.single('file'), async(req,res, next) =>{
        const email = req.body.email;

        const user = await User.findOne({email:email});

      const avatar = req.file ? req.file.path : req.body.file;
      const username = req.body.username;
      const normalizedUsername = removeAccents(username);
      // console.log(normalizedUsername);

    //     console.log(avatar)
    //   console.log(req.body);
      const users = {
        username:username,
        avatar:avatar,
        normalizedUsername:normalizedUsername

      }
      // console.log(users)

     try { 
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, // Điều kiện tìm kiếm
            { $set:  users },// Cập nhật trường username
            { new: true } // Trả về tài liệu đã cập nhật
        );
        res.json(updatedUser);
     } catch (error) {
            res.json(error)
     }
      })

      router.post('/search', async (req, res) => {
        const { username } = req.body;
        // console.log(username)
        try {
            // Loại bỏ dấu từ từ khóa tìm kiếm
            const normalizedUsername = removeAccents(username);
            // console.log(normalizedUsername);
    
            // Tìm kiếm trong bảng users với điều kiện username đã loại bỏ dấu
            const users = await User.find({
              normalizedUsername: { $regex: normalizedUsername, $options: 'i'}
            }).limit(10);
    
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Có lỗi xảy ra', error });
        }
    });


    router.post('/login', uploadCloud.none(), async (req,res) =>{
      const email = req.body.email;
      const password = req.body.password;
      // console.log('hello')
      // console.log(req.body)
      try{
          const ifUsser = await User.findOne({ email: email });
  
          if(ifUsser){
             const ispassword = await bcrypt.compare(password,ifUsser.password);
             if(ispassword){
              // const token = jwt.sign({ id_user: ifUsser._id, role: ifUsser.role, email:ifUsser.email }, ma, { expiresIn: '1h' });
              // console.log(token);
              // res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
              res.json({thongbao:true, id_user:ifUsser._id,email:ifUsser.email})
             }else{
              res.json({thongbao:false,loi:"sai mật khẩu"})
             }
          }else{
              res.json({thongbao:false,loi:"email k tồn tại"});
          }
  
      }catch(err){
          res.status(500).json({ thongbao: false,loi:"Lỗi server" });
      }
  })


module.exports = router;
