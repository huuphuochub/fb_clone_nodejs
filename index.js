const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http =require('http');
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const bodyParser = require("body-parser");

const socketIo = require('socket.io');
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }
});
let cors = require('cors'); // Thêm dòng này

const socketio = require('./router/socketio');

socketio(io)


// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/media', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

// Middleware để parse JSON
app.use(express.json());
app.use(cookieParser());

app.use(cors()); // Thêm dòng này để cho phép CORS
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers','Authorization')
    //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5502'); 

  next();
});

const userrouter = require('./router/user')
const friendrouter = require('./router/friend')
const messenger = require('./router/mesenger')
const postrouter = require('./router/post')
const folowerrouter = require('./router/folower');
const likeRouter = require('./router/likerouter');
const notification = require('./router/notification')




app.use('/user',userrouter);
app.use('/friend', friendrouter);
app.use('/messenger', messenger);
app.use('/post', postrouter);
app.use('/folower', folowerrouter);
app.use('/like',likeRouter)
app.use('/notification',notification)






