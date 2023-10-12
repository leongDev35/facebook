import { io } from "../../app.js";
import { commentPostSocket, likePostSocket } from "../controller/posts.controller.js";
import { createNotifSocket } from "../controller/socketController/notif.socket.controller.js";



export function postEventHandle(socket) {
  try {
    socket.on('like', async (p,u) => {
      const post = await likePostSocket(p,u)
    if(post.type == 'like' ) {
      const actionUserId = u;
      const receiverUserId = post.data.ownerPost._id;
        const typeNotif = "like";
        const postIdNotif = post.data._id; //! để link đến trang post
        createNotifSocket(actionUserId, receiverUserId,typeNotif,postIdNotif,socket.id)
     //! cần biết socket của ownerPost

    

    }
      


    io.emit('like', post.data);
  });
  socket.on('comment', async (p,u, comment) => {
    const commentS = await commentPostSocket(p,u,comment)
    const typeNotif = "comment";
    console.log(commentS.data.ownerPost._id);
    createNotifSocket(u, commentS.data.ownerPost._id,typeNotif,p,socket.id)

  io.emit(`comment${p}`, commentS.comments,p);
});
  } catch (error) {
    console.log(error);
  }
    
}