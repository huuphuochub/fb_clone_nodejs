const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Friend = require('../model/friend')
const uploadCloud = require('../config/cloud');
const User = require('../model/user')

require('dotenv').config();
const removeAccents = require('remove-accents');


router.post('/addfriend', uploadCloud.none(), async(req,res) =>{
    const id_user1 = req.body.id_user1;
    const id_user2 = req.body.id_user2;
    // const status = 1;
    // console.log(req.body)
    const date = new Date().toLocaleString()

   try {
    const add = new Friend({
        id_user1:id_user1,
        id_user2:id_user2,
        status:1,
        date:date

    })
    const luu = add.save()
    res.json(true)
   } catch (error) {
        res.status(400).json(error)
   }
})

router.get('/', async(req,res) =>{
    try {
        const allfriend = await Friend.find()
        res.json(allfriend)
    } catch (error) {
        res.status(400).json(error)
    }
})

router.get('/allfriend/:id', async(req,res) =>{
    const id = req.params.id
// console.log(id)
    try {
        const friends = await Friend.find({
            $or: [
                { id_user1: id },
                { id_user2: id }
            ]
        });
res.json(friends);
} catch (error) {
        res.status(500).json(error)
    }
})
router.get('/getallfriend/:id', async(req,res) =>{
    const id = req.params.id.toString()
    // console.log(req.params.id_user)
// console.log(id)
    try {
        const friends = await Friend.find({
            $or: [
                { id_user1: id,status:2 },
                { id_user2: id, status:2 }
            ]
        }); 
res.json(friends); 
} catch (error) { 
        res.status(500).json(error)
    } 
}) 
 

router.post('/laytatcabancuauser', async(req,res) =>{ 
    const ids = req.body 
    console.log("mảng í bạn của bạn " + ids)
    const friends = await Friend.find({
        $and: [  
            { status: 2 },
            {
                $or: [
                    { id_user1: { $in: ids } },
                    { id_user2: { $in: ids } }
                ]
            } 
        ]
    });
    
    res.json(friends)
})
router.get('/getallfriendbyuerr/:id', async(req,res) =>{
    const id = req.params.id.toString()
    // console.log(req.params.id_user)
// Bước 1: Lấy các `id_user` liên quan
    Friend.find({
    $or: [{ id_user1: id }, { id_user2: id }],
    status: 2
  }).select('id_user1 id_user2 -_id').lean().then(friends => {
    // Tạo danh sách các `id_user` (lọc trùng lặp)
    const relatedUserIds = new Set();
    friends.forEach(friend => {
      if (friend.id_user1 !== id) relatedUserIds.add(friend.id_user1);
      if (friend.id_user2 !== id) relatedUserIds.add(friend.id_user2);
    });
  
    // Bước 2: Lấy thông tin người dùng từ danh sách `id_user`
    return User.find({ _id: { $in: [...relatedUserIds] } });
  }).then(users => {
    // `users` chứa thông tin của tất cả người dùng liên quan
    res.json(users);
  }).catch(err => {
    console.error(err);
  });
  
}) 

router.put('/acpfriend', uploadCloud.none(), async(req,res) =>{
    const id =req.body.id_friend;
    console.log(id);
    try {   
        // console.log(id)
        const update = await Friend.findByIdAndUpdate(id,{status:2},{new:true})
        // console.log(update)
        if(update){
            res.json(true)
        }else{
            res.status(404).json({loi:"không kết bạn đc "})
        }
    } catch (error) {
        res.status(500).json(error);
    }
})
router.delete('/cancelloimoi/:id', uploadCloud.none(), async(req,res) =>{
    const id =req.params.id

    try {
        // console.log(id)
        const deletes = await Friend.findByIdAndDelete(id)
        // console.log(deletes)
        if(deletes){
            res.json(true)
        }else{
            res.status(404).json({loi:"không kết bạn đc "})
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;
