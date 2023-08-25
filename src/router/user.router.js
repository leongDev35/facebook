import express from "express";
import { getUsers, createUser, getUser, updateUser, deleteUser, login, logout, updatePassword, sentNewPassword, confirmEmail, search } from "../controller/users.controller.js";

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

userRouter.get('/test', function(req, res) {
    console.log("test");
})

//! search
userRouter.get('/search', search);






export default userRouter;
