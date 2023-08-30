import express from "express";
import { createPost, deletePost, getPosts, likePost, updatePost } from "../controller/posts.controller.js";

const postRouter = express.Router();

//! CRUD
postRouter.post('', createPost)
postRouter.get('', getPosts)
postRouter.put('/info/:postId', updatePost)
postRouter.delete('/info/:postId', deletePost)

//! Like
postRouter.put('/like', likePost)




export default postRouter;
