import { io } from "../../app.js";
import { commentPostSocket, likePostSocket } from "../controller/posts.controller.js";



export function postEventHandle(socket) {
    socket.on('like', async (p,u) => {
        const post = await likePostSocket(p,u)
      io.emit('like', post);
    });
    socket.on('comment', async (p,u, comment) => {
      const commentS = await commentPostSocket(p,u,comment)
    io.emit(`comment${p}`, commentS,p);
  });
}