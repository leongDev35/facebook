import pageRouter from "./page.router.js";
import postRouter from "./post.router.js";
import userRouter from "./user.router.js";

const router = (app) => {
    app.use('/users', userRouter)
    app.use('/posts', postRouter)
    app.use('/pages', pageRouter)
}
export default router;
