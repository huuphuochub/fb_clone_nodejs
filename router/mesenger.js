const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const User = require('../model/user')
const Room = require('../model/roomchat')
const Chat = require('../model/chat')
const uploadCloud = require('../config/cloud');
var nodemailer = require('nodemailer');
require('dotenv').config();
const removeAccents = require('remove-accents');


  router.post('/addroom',uploadCloud.none(), async(req,res) =>{
    // const addroom = await Room.save(req.body);
    const id_users = req.body.id_user;
    const type = req.body.type;
    const lastmess = req.body.lastmess
    // console.log(req.body)
    // console.log("dữ liệu room " + id_users);
  try {
    const newroom = new Room({
        id_user:id_users,type:type,lastmess:lastmess
    })
    const save = newroom.save()
    res.json(true) 
  } catch (error) {
        res.status(500).json(error)
  }

})
router.post('/addgroupchat', uploadCloud.single('file'), async(req,res) =>{  
  // console.log(req.body.id_user)
  // console.log(req.file.path)

  try {
    const room = new Room({
      id_user:req.body.id_user,type:req.body.type,name:req.body.name, image:req.file ? req.file.path : req.body.file,lastmess:req.body.lastmess

    })
    const add = room.save()
    res.json(true);
  } catch (error) {
    
  }
})


router.get('/getallroombyuser/:id', async(req,res) =>{
  const id = req.params.id;

  try {
      const rooms = await Room.find({ id_user: id  ,type:1})
      .sort({ date: -1 })
      .limit(20);
      res.json(rooms);
  } catch (error) {
      res.status(500).json(error);
  }
})

router.get('/getallgroupchatbyuser/:id', async(req,res) =>{
  const id = req.params.id;

  try {
      const rooms = await Room.find({ id_user: id ,type:2})
      .sort({ date: -1 })
      .limit(20);
      res.json(rooms);
  } catch (error) {
      res.status(500).json(error);
  }
})


router.get('/getchatbyroom/:id', async(req,res)=>{
  const id = req.params.id
  // console.log(id)
  try {
    const chat = await Chat.find({ id_room: id })
    .sort({ date: -1 })
    .limit(20);
    res.json(chat);
  } catch (error) {
    
  }
})

router.post('/sendchat', uploadCloud.single('file'), async(req,res) =>{
  const id_user = req.body.id_user;
  const content = req.body.content;
  const image = req.file ? req.file.path : req.body.file;
  const id_room = req.body.id_room;
  const username = req.body.username;
  const avatar = req.body.avatar;
  const status = 1
  const sendstatus = 1;

  let lastmesss = '';
  console.log(image ==='');
  
  if(content && image !==''){
    lastmesss = 'đã gửi 1 ảnh'
  }else if(!content && image !==''){
    lastmesss = 'đã gửi 1 ảnh'
  }else if(content && image === ''){
    lastmesss = content;
  }
  // console.log(id_room,id_user,content,image,status,sendstatus);
  try {
    const luu = new Chat({
      id_room:id_room,
      id_user:id_user,
      content:content,
      image:image,
      username:username,
      avatar:avatar,
      status:status,
      sendstatus:sendstatus,
    })
    const save = luu.save();

    const update = await Room.findByIdAndUpdate(
      id_room, 
      { 
        lastmess: lastmesss.length > 15 ? lastmesss.substring(0, 15) + '...' : lastmesss,
        lastuser: id_user,
          date:Date.now(), 
      }, 
      { new: true }
  ); 
  // console.log(update);
  } catch (error) {
    // console.log(error)
  }finally{
    res.json(true);
  }
  
})




module.exports = router;
