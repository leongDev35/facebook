import express from "express";
import router from "./src/router/router.js";
import 'dotenv/config';
import ConnectDB from './src/models/connectDB.js';
import bodyParser from 'body-parser'
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { postEventHandle } from "./src/socket/post.socket.js";
import { messageEventHandle } from "./src/socket/message.socket.js";
import { resetSocketIdToUser, saveSocketIdToUser } from "./src/controller/users.controller.js";

//! connect db
const db = new ConnectDB();
db.connect()
    .then((res) => {
        console.log('Database connected successfully');
    })
    .catch((err) => console.log(err));
//! app express  
const app = express();
const httpServer = createServer(app);
app.use(cors());
const port = process.env.PORT || 3050;
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
router(app)
//! socket.io
export const io = new Server(httpServer, { 
    cors: {
        origin: `https://leong-facebook-fe.onrender.com/`
      }
});

io.on('connection', async (socket) => {
    //! lưu socket.id vào trong db 
    
    await saveSocketIdToUser(socket.handshake.auth.userId, socket.id)
    console.log('A user connected',socket.id);
    io.emit('friendConnected',socket.handshake.auth.userId,socket.id)
    postEventHandle(socket)
    messageEventHandle(socket)
    socket.on('disconnect', (reason) => {
      io.emit('friendConnected',socket.handshake.auth.userId,'')
      resetSocketIdToUser(socket.handshake.auth.userId)
      //! xóa socket.id trong db
      console.log('A user disconnected', reason);
    });
  });
httpServer.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});