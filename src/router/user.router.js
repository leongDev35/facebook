import express from "express";
import { getUsers, createUser, getUser, updateUser, deleteUser, login, logout, updatePassword, sentNewPassword, confirmEmail, search } from "../controller/users.controller.js";
import { createChatWithFriend, getChatWithFriend, getListFriendChat } from "../controller/chat.controller.js";

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

//! chat
userRouter.post('/chat', createChatWithFriend);
userRouter.get('/chat', getChatWithFriend);
userRouter.get('/chat/listFriend', getListFriendChat)

export default userRouter;
