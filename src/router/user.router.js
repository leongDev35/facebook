import express from "express";
import { getUsers, createUser, getUser, updateUser, deleteUser, login, logout, updatePassword, sentNewPassword, confirmEmail, search, searchUsersByKeyword } from "../controller/users.controller.js";
import { createChatWithFriend, getChatWithFriend, getListFriendChat } from "../controller/chat.controller.js";
import { checkStranger, deleteFriend, getFriend, getStranger, responseFriendRequest, sendFriendRequest } from "../controller/friend.controller.js";
import { createNotif, getNotifs } from "../controller/socketController/notif.socket.controller.js";

const userRouter = express.Router();

//! CRUD
userRouter.post('', createUser)
userRouter.get('', getUsers)
userRouter.get('/info/:userId', getUser)
userRouter.put('/info/:userId', updateUser)
userRouter.delete('/delete/:userId', deleteUser);

//! login logout
userRouter.post('/login', login)
userRouter.get('/logout', logout);


//! password
userRouter.put('/password/:userId', updatePassword);
userRouter.post('/sentNewPassword', sentNewPassword);

//! email

userRouter.get('/confirmEmail/:token', confirmEmail)


//! search
userRouter.get('/search', search);
userRouter.get('/searchByKeyword', searchUsersByKeyword);

//! chat
userRouter.post('/chat', createChatWithFriend);
userRouter.get('/chat', getChatWithFriend);
userRouter.get('/chat/listFriend', getListFriendChat)


//! Friends
userRouter.post('/friend/request', sendFriendRequest)
userRouter.post('/friend/accept', responseFriendRequest)
userRouter.delete('/friend/delete', deleteFriend)
userRouter.get('/friend', getFriend)
userRouter.get('/stranger', getStranger)
userRouter.get('/checkStranger', checkStranger)

//! notif
userRouter.post('/notif', createNotif)
userRouter.get('/notif', getNotifs)

export default userRouter;
