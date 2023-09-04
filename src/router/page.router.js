import express from "express";
import { createPage } from "../controller/page.controller.js";
const pageRouter = express.Router();

//! CRUD
pageRouter.post('', createPage)
export default pageRouter;