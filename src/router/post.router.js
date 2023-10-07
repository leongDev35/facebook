import express from "express";
import { createPost, deletePost, getPosts, likePost, updatePost ,commentPost, deleteCommentPost, getComments} from "../controller/posts.controller.js";

const postRouter = express.Router();

//! CRUD
postRouter.post('', createPost)
postRouter.get('', getPosts)
postRouter.put('/info/:postId', updatePost)
postRouter.delete('/info/', deletePost)

//! Like
postRouter.put('/like', likePost)


//! Comment
postRouter.post('/comment', commentPost)
postRouter.delete('/comment', deleteCommentPost)
postRouter.get('/comment', getComments)


export default postRouter;
