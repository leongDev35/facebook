import userRouter from "./user.router.js";

const router = (app) => {
    app.use('/users', userRouter)
}
export default router;
