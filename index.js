const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

// Khởi tạo ứng dụng Express
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Kết nối đến MongoDB
//mongodb://localhost:27017/tên-database-của-bạn
// mongo atlas url mongodb+srv://huuphuoc532004:Nhp0503@media.geykc.mongodb.net/media?retryWrites=true&w=majority&appName=media
mongoose.connect('mongodb://localhost:27017/media', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware để parse JSON 
app.use(express.json());
app.use(cookieParser()); 
app.use(bodyParser.json()); 
app.use(cors({
  origin: '*', // Hoặc chỉ định URL cụ thể nếu cần
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware để thêm header CORS (có thể bỏ qua nếu cors middleware đã được cấu hình)
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Expose-Headers', 'Authorization');
//   next();
// });

// Khởi tạo Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
  }
});

const socketio = require('./router/socketio');
socketio(io);

// Cấu hình các router
const userrouter = require('./router/user');
const friendrouter = require('./router/friend');
const messenger = require('./router/mesenger');
const postrouter = require('./router/post');
const folowerrouter = require('./router/folower');
const likeRouter = require('./router/likerouter');
const notification = require('./router/notification');
const comment = require('./router/comment');
const story = require('./router/story');

app.use('/user', userrouter);
app.use('/friend', friendrouter);
app.use('/messenger', messenger);
app.use('/post', postrouter);
app.use('/folower', folowerrouter);
app.use('/like', likeRouter);
app.use('/notification', notification);
app.use('/comment', comment);
app.use('/story', story);

// Khởi động server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
