import { io } from "../../app.js";
import { saveChatWithFriendSocket, getChatWithFriendSocket } from "../controller/chat.controller.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";



export function messageEventHandle(socket) {
    socket.on('message', async (user,partner,message,socketId, messageImage) => {
        
        //! cần biết được socketId của partner
        const partnerFind = await User.findOne({ _id: partner._id })
        const sender = {_id: user._id, fullName: user.fullName, avatarUrl: user.avatarUrl}
        const messageDB = new Message({
            content: message,
            contentUrlImage: messageImage,
            senderId: user._id,
            receiverId: partner._id
        })
        await messageDB.save();
        const messageSocket = {
            _id: messageDB._id,
            content: message,
            contentUrlImage: messageImage,
            senderId: sender,
            receiverId: partner,
            isSeen: false,
            date: messageDB.date
        }
        
        //! Gửi tức thì tin nhắn đến người nhận 
      io.to(partnerFind.socketId).emit('message', messageSocket);
        //! Gửi tức thì tin nhắn đến người gửi 
      io.to(socketId).emit('message', messageSocket);
      //! lưu vào database 
      saveChatWithFriendSocket(user._id, partner._id,messageDB._id)


    });

    socket.on("scrollToLoadMessage", async (userId,partnerId,after,socketId) => {
      const moreMessage = await getChatWithFriendSocket(userId, partnerId, after)
        moreMessage.messages.reverse()

        console.log(moreMessage.messages,44);
        io.to(socketId).emit('scrollToLoadMessage', moreMessage);
    })

    socket.on('clickTab', async (userId,partnerId,socketId)=>{
       
        // let lastMessageId = '';
        const message = await getChatWithFriendSocket(userId, partnerId)
        message.messages.reverse()
    
    //     const partnerFind = await User.findOne({ _id: partnerId })
    // const foundPartner = partnerFind.chatWithFriend.find(chat => chat.partner.toString() === userId);

    //     if (foundPartner) {
    //         // Nếu tìm thấy partner, bạn có thể truy cập id của lastMessage như sau
    //         lastMessageId = foundPartner.lastMessage.toString();
    //         console.log("Id của lastMessage:", lastMessageId);
    //       } else {
    //         console.log("Không tìm thấy partner với id:", partnerIdToFind);
    //       }
    //     console.log(partnerFind,456);
    //     //! sự kiện đọc tin nhắn của partner,
    //     io.to(socketId).emit('seenMessage', partnerId);
    //     io.to(partnerFind.socketId).emit('partnerSeenMessage', userId, lastMessageId);
    //     //! Lấy các tin nhắn với partners gửi qua socketId , socketId la id cua user clickTab
        io.to(socketId).emit('clickTab', message);
    // //! cần id của lastMessage 
    //       console.log(lastMessageId,123)
    //       await Message.updateOne({_id: lastMessageId}
    //         ,
    //         {$set: {isSeen: true}}
    //         )
    //         const lastMessage = await Message.findById(lastMessageId)
    //         await Message.updateMany(
    //           {
    //             senderId: partnerId,
    //             receiverId: userId,
    //             date: { $lt: lastMessage.date } // Tìm tin nhắn có ngày trước lastMessageDate
    //           },
    //           { $set: { isSeen: true } } // Đặt isSeen thành true
    //         );  
        
    //     //! thay đổi isSeen của tin nhắn cuối cùng thành true

    })
    socket.on('focusNewMessage', async (userId,partnerId,socketId)=>{
       
      let lastMessageId = '';
      const partnerFind = await User.findOne({ _id: partnerId })
  const foundPartner = partnerFind.chatWithFriend.find(chat => chat.partner.toString() === userId);

      if (foundPartner) {
          // Nếu tìm thấy partner, bạn có thể truy cập id của lastMessage như sau
          lastMessageId = foundPartner.lastMessage.toString();
          console.log("Id của lastMessage:", lastMessageId);
        } else {
          console.log("Không tìm thấy partner với id:", partnerIdToFind);
        }
      console.log(partnerFind,456);
      //! sự kiện đọc tin nhắn của partner,
      io.to(socketId).emit('seenMessage', partnerId);
      io.to(partnerFind.socketId).emit('partnerSeenMessage', userId, lastMessageId);
      
  //! cần id của lastMessage 
        console.log(lastMessageId,123)
        await Message.updateOne({_id: lastMessageId}
          ,
          {$set: {isSeen: true}}
          )
          const lastMessage = await Message.findById(lastMessageId)
          await Message.updateMany(
            {
              senderId: partnerId,
              receiverId: userId,
              date: { $lt: lastMessage.date } // Tìm tin nhắn có ngày trước lastMessageDate
            },
            { $set: { isSeen: true } } // Đặt isSeen thành true
          );  
      
    

  })
   
 
}