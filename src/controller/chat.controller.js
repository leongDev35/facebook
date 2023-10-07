//! CRUD
//!Tạo một đoạn chat với bạn

import Message from "../models/message.model.js";
import User from "../models/user.model.js";

//!Phải lưu cả ở người gửi và người nhận 
export async function createChatWithFriend(req, res) {
    try {
        const userId = req.body.userId;
        const partnerId = req.body.partnerId;
        const message = req.body.message;

        const messageDB = new Message({
            content: message,
            senderId: userId,
            receiverId: partnerId
        })
        await messageDB.save();
        console.log(messageDB._id)
        //! xét xem có partner như thế không, nếu có thì push message vào, nếu không thì tạo mới rồi mới push

        const UserCheck = await User.findOne(
            { "_id": userId, "chatWithFriend.partner": partnerId },

        )
        if (!UserCheck) { //! trường hợp không có partner vs id như vậy
            await User.updateOne(
                { _id: userId },
                {
                    $push: {
                        chatWithFriend: {
                            partner: partnerId,
                            message: {
                                idMessage: messageDB._id
                            },
                            lastMessage: messageDB._id
                        }
                    }
                }
            );

        } else {
            //! UPDATE MẢNG LỒNG TRONG MẢNG: IMPORTANT
            await User.updateOne(
                { "_id": userId, "chatWithFriend.partner": partnerId },
                {
                    $push:
                    {
                        "chatWithFriend.$.message":
                        {
                            "idMessage": messageDB._id
                        }
                    },
                    $set: { "chatWithFriend.$.lastMessage": messageDB._id }
                }
            )

        }
        const partnerCheck = await User.findOne(
            { "_id": partnerId, "chatWithFriend.partner": userId },

        )
        if (!partnerCheck) { //! trường hợp không có partner vs id như vậy
            await User.updateOne(
                { _id: partnerId },
                {
                    $push: {
                        chatWithFriend: {
                            partner: userId,
                            message: {
                                idMessage: messageDB._id
                            },
                            lastMessage: messageDB._id
                        }
                    }
                }
            );

        } else {
            //! UPDATE MẢNG LỒNG TRONG MẢNG: IMPORTANT
            await User.updateOne(
                { "_id": partnerId, "chatWithFriend.partner": userId },
                {
                    $push:
                    {
                        "chatWithFriend.$.message":
                        {
                            "idMessage": messageDB._id
                        }
                    },
                    $set: { "chatWithFriend.$.lastMessage": messageDB._id }
                }
            )
        }

        return res.json({ message: 'Thêm message thành công' });
    } catch (err) {
        console.log(err);
        return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
}
export async function saveChatWithFriendSocket(userId, partnerId, messageId) {
    try {
       
        //! xét xem có partner như thế không, nếu có thì push message vào, nếu không thì tạo mới rồi mới push

        const UserCheck = await User.findOne(
            { "_id": userId, "chatWithFriend.partner": partnerId },

        )
        if (!UserCheck) { //! trường hợp không có partner vs id như vậy
            await User.updateOne(
                { _id: userId },
                {
                    $push: {
                        chatWithFriend: {
                            partner: partnerId,
                            message: {
                                idMessage: messageId
                            },
                            lastMessage: messageId
                        }
                    }
                }
            );

        } else {
            //! UPDATE MẢNG LỒNG TRONG MẢNG: IMPORTANT
            await User.updateOne(
                { "_id": userId, "chatWithFriend.partner": partnerId },
                {
                    $push:
                    {
                        "chatWithFriend.$.message":
                        {
                            "idMessage": messageId
                        }
                    },
                    $set: { "chatWithFriend.$.lastMessage": messageId }
                }
            )

        }
        const partnerCheck = await User.findOne(
            { "_id": partnerId, "chatWithFriend.partner": userId },

        )
        if (!partnerCheck) { //! trường hợp không có partner vs id như vậy
            await User.updateOne(
                { _id: partnerId },
                {
                    $push: {
                        chatWithFriend: {
                            partner: userId,
                            message: {
                                idMessage: messageId
                            },
                            lastMessage: messageId
                        }
                    }
                }
            );

        } else {
            //! UPDATE MẢNG LỒNG TRONG MẢNG: IMPORTANT
            await User.updateOne(
                { "_id": partnerId, "chatWithFriend.partner": userId },
                {
                    $push:
                    {
                        "chatWithFriend.$.message":
                        {
                            "idMessage": messageId
                        }
                    },
                    $set: { "chatWithFriend.$.lastMessage": messageId }
                }
            )
        }

        console.log('Thêm message thành công' );
    } catch (err) {
        console.log(err);
    }
}

export async function getChatWithFriend(req, res) {
    try {
        const limit = 20;
        const after = req.query.after; // Giá trị con trỏ trong message
        const userId = req.query.userId;
        const partnerId = req.query.partnerId;
        let query = {};


        const user = await User.findOne(
            { "_id": userId, "chatWithFriend.partner": partnerId }
        )

        const mappingPartner = user.chatWithFriend.find(partner => partner.partner.toString() == partnerId)
        const IdsMessage = mappingPartner.message.map(obj => obj.idMessage); //! Lấy mảng id của message
        //! AFTER
        if (after) {
            query = {
                date: { $lt: new Date(after) },
                _id: { $in: IdsMessage }
            };
        } else {
            query = {
                _id: { $in: IdsMessage }
            };
        }

        const messages = await Message.find(query).limit(limit).sort({ date: -1 }).populate({ //! chọn trường để lấy
            path: 'senderId',
            select: 'avatarUrl fullName',
          }).populate({ //! chọn trường để lấy
            path: 'receiverId',
            select: 'avatarUrl fullName',
          }); //! sort theo bài viết mới nhất
          res.json({ messages, endCursor: messages.length > 0 ? messages[messages.length - 1].date : null, partnerId:partnerId  }); //! lưu giá trị endCursor để sử lý bên FE
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
}
export async function getChatWithFriendSocket(userId, partnerId, after) {
    try {
        const limit = 20;
        
        
        let query = {};


        const user = await User.findOne(
            { "_id": userId, "chatWithFriend.partner": partnerId }
        )

        const mappingPartner = user.chatWithFriend.find(partner => partner.partner.toString() == partnerId)
        const IdsMessage = mappingPartner.message.map(obj => obj.idMessage); //! Lấy mảng id của message
        //! AFTER
        if (after) {
            query = {
                date: { $lt: new Date(after) },
                _id: { $in: IdsMessage }
            };
        } else {
            query = {
                _id: { $in: IdsMessage }
            };
        }

        const messages = await Message.find(query).limit(limit).sort({ date: -1 }).populate({ //! chọn trường để lấy
            path: 'senderId',
            select: 'avatarUrl fullName ',
          }).populate({ //! chọn trường để lấy
            path: 'receiverId',
            select: 'avatarUrl fullName',
          }); //! sort theo bài viết mới nhất
          return { messages, endCursor: messages.length > 0 ? messages[messages.length - 1].date : null, partnerId:partnerId  }; //! lưu giá trị endCursor để sử lý bên FE
        
    } catch (error) {
        console.log(error);
        
    }
}



export async function getListFriendChat(req, res) {
    try {
        const limit = 10;
        const after = req.query.after; // Giá trị con trỏ trong message
        const userId = req.query.userId;
        const partnerId = req.query.partnerId;
        let query = {};

        const user = await User.findById(userId).populate(
            {
                path: 'chatWithFriend.lastMessage'
            }).populate(
                {
                    path: 'chatWithFriend.partner',
                    select: '_id fullName avatarUrl socketId'
                }
        ); 
        const chatPartners = user.chatWithFriend.map((chat) => 
             { return {
                partner:chat.partner,
                lastMessage:chat.lastMessage
            }
            
        });
        //! sắp xếp lại danh sách theo lastMessage
        chatPartners.sort((a, b) => new Date(b.lastMessage.date) - new Date(a.lastMessage.date));


        

       res.json(chatPartners);
    } catch (error) {
        console.log(error);
    }
}

export async function sentMessageSocket(userId,partnerId,message) {
    try {
      console.log(userId);
      console.log(partnerId);
      console.log(message);
     
  
    } catch (err) {
      console.log(err);
  
    }
  }