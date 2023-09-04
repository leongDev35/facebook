import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Page from "../models/page.model.js";

//! CRUD

export async function createPage(req, res) {
    try {
        const page = new Page({
            name: req.body.name,
            ownerPage: req.body.ownerId
          });
          await page.save();
          //! luu bai page vao trong User tao
          
          return res.json({
            message: 'Tạo page thành công',
            page: page
          });
    } catch (error) {
        console.log(error);
    }
}



