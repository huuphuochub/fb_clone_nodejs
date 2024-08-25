const Friend = require('../model/friend')
const notification = require('../model/notification')
module.exports = (io) => {
  let onlineUsers = {};
  let arruseronl=[] 
    io.on('connection', (socket) => {
    

      socket.on('online', async( id_user) => {
        console.log(id_user);
        onlineUsers = { id_user:id_user, id_socket:socket.id} 
        arruseronl.push(onlineUsers) // Lưu trữ socket.id với username
        // console.log(`đã online với id ${socket.id} và id_user là :${id_user}`);
        try {
            const friend = await Friend.find({
              $or:[
                {id_user1:id_user,status:2},
                {id_user2:id_user,status:2}
              ]
            });
            let friends =[]
            friend.forEach(item=>{
              if(item.id_user1 === id_user){
                friends.push(item.id_user2)
              }else {
                friends.push(item.id_user1)
              }
            })
            console.log(friends)
            console.log(`iduser ${id_user} có các bạn là ${friends} đang onl`)
            arruseronl.forEach(user =>{
              if(friends.includes(user.id_user)){
                io.to(user.id_socket).emit('frienonline',id_user);
                console.log(`id_user ${id_user} đang onl `)
              }
            })
            let arridfriend =[]
            arruseronl.forEach(user =>{
              if(friends.includes(user.id_user)){
                arridfriend.push(user.id_user);
              }
            })
            io.to(socket.id).emit('getallfriendonline',arridfriend);
        } catch (error) {
          
        }
        // Gửi danh sách người dùng online cho tất cả các client khác
        console.log('mangr nhung nguoi dang onlie o duoi')
        console.log(arruseronl);
        // socket.broadcast.emit('onlineUsers', Object.keys(onlineUsers)); 
      });

      console.log('A user connected');
  
      // Ví dụ về sự kiện chat message
      socket.on('sendmess', (id_user,id_room) => {
          arruseronl.forEach(item =>{
            if(id_user.includes(item.id_user)){
              io.to(item.id_socket).emit('receicemess',id_room)
            }
          })
      });
  

      socket.on('offer', (offer) => {
        console.log(offer)
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });

 

      socket.on('notifyUser',  (id_user, thongbao) => {
        try {
            // Lưu thông báo vào cơ sở dữ liệu
            // const addnoti = new Notification({
            //     id_user: id_user,
            //     content: thongbao
            // });
            // await addnoti.save(); // Chờ lưu thông báo thành công
    
            // Gửi thông báo đến các người dùng trực tuyến có id_user trong arruseronl
            arruseronl.forEach(item => {
                if (id_user.includes(item.id_user)) {
                    io.to(item.id_socket).emit('notification', thongbao);
                }
            });
        } catch (error) {
            console.error("Error in notifyUser:", error);
        }
    });



    
    socket.on('notifyfriend',  (id_user, thongbao) => {
      try {
          // Lưu thông báo vào cơ sở dữ liệu
          // const addnoti = new Notification({
          //     id_user: id_user,
          //     content: thongbao
          // });
          // await addnoti.save(); // Chờ lưu thông báo thành công
  
          // Gửi thông báo đến các người dùng trực tuyến có id_user trong arruseronl
          arruseronl.forEach(item => {
              if (id_user.includes(item.id_user)) {
                  io.to(item.id_socket).emit('notifyfriend', thongbao);
              }
          });
      } catch (error) {
          console.error("Error in notifyUser:", error);
      }
  });
    







      // Bạn có thể thêm nhiều sự kiện khác tại đây
      socket.on('disconnect', async() => {

        console.log('Client đã ngắt kết nối');
      
        // Tìm và xóa người dùng khi ngắt kết nối
        let disconnectedUser = null;
        let id_user = ''
        for(let i = 0; i<arruseronl.length;i++){
          if(arruseronl[i].id_socket === socket.id){
            console.log(`${arruseronl[i].id_user} đã ngắt kết nối`);
            id_user = arruseronl[i].id_user
            arruseronl.splice(i, 1); // Xóa người dùng khỏi mảng arruseronl
            break;
          }
        }

         try {
            const friend = await Friend.find({
              $or:[
                {id_user1:id_user,status:2},
                {id_user2:id_user,status:2}
              ]
            });
            let friends =[]
            friend.forEach(item=>{
              if(item.id_user1 === id_user){
                friends.push(item.id_user2)
              }else {
                friends.push(item.id_user1)
              }
            })
            console.log(friends)
            console.log(`iduser ${id_user} có các bạn là ${friends} đang onl`)
            arruseronl.forEach(user =>{
              if(friends.includes(user.id_user)){
                io.to(user.id_socket).emit('friendofline',id_user);
                console.log(`id_user ${id_user} đang onl `)
              }
            })
          }catch{

          }
      
      
      });













    });
  };
  