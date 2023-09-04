import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Page from "../models/page.model.js";
import { request } from "express";

//! CRUD

export async function createPost(req, res) {
  try {
    const ownerId = req.body.ownerId;
    const pageId = req.body.pageId;
    //! dau tien phai check xem Page id nhu the khong. Neu khong co thi check user xem co khong


    //! check owner cua post co thuoc member or admin page khong
    const ownerPostCheck = await Page.findOne({
      _id: pageId,
      $or : [{ownerPage: ownerId}, {'member.idUser': ownerId}] //! query obj trong 1 mang ma mang lai la thuoc tinh cua Schema
    })

    if(ownerPostCheck) {
      if (ownerId != pageId) {
        //! tạo post trong page. 
        const post = new Post({
          content: req.body.content,
          ownerPost: ownerId,
          pageId: pageId
        });
        await post.save();
        await User.updateOne(
          { _id: ownerId },
          {
            $push: {
              postsInPage: {
                pageId: pageId,
                postId: post._id
              }
            }
          }
        );
        await Page.updateOne(
          { _id: pageId },
          {
            $push: {
              postsInPage: {
                postId: post._id
              }
            }
          }
        );
        return res.json({
          message: 'Tạo post trong page thành công',
          post: post
        });
  
      } else {
        const post = new Post({
          content: req.body.content,
          ownerPost: ownerId
        });
        await post.save();
        await User.updateOne(
          { _id: req.body.ownerId },
          {
            $push: {
              postInProfile: {
                postId: post._id
              }
            }
          }
        );
        return res.json({
          message: 'Tạo post trong profile thành công',
          post: post
        });
      }
    } else {
    res.status(500).json({ message: 'Ban khong phai member cua Page nay' });

    }
  //! xét xem  đang ở trang nào để tạo bài, profile hay pages
    

    //! luu bai post vao trong User tao




  } catch (error) {
    console.log(error);
  }
}

export async function getPosts(req, res) {
  try {
    const page = req.query.page
    const after = req.query.after; // Giá trị con trỏ
    const userId = req.query.userId;
    const pageId = req.query.pageId;
    let query = {};
    if (after) {

      //! trả về các bài post có thời gian trước after, bài cũ hơn
      //! query là một đối tượng truy vấn đến DB
      if (userId) { //! trang của từng user
        const postInUser = (await User.findById(userId)).posts;
        const IdsPostInUser = postInUser.map(obj => obj.postId); //! Lấy post của User
        query = {
          date: { $lt: new Date(after) },
          _id: { $in: IdsPostInUser }
        };
      } else if (pageId) { //! các page có id page riêng
        const postInPage = (await Page.findById(pageId)).postInPage;
        const IdsPostInPage = postInPage.map(obj => obj.postId); //! Lấy post của User
        query = {
          date: { $lt: new Date(after) },
          _id: { $in: IdsPostInPage }
        };
      } else { //! trang chủ
        query = { date: { $lt: new Date(after) } }; //! tìm date giá trị nhỏ hơn after. Tức các bài viết cũ hơn giá trị after

      }

    }

    const limit = 10;
    const posts = await Post.find(query).limit(limit).sort({ date: -1 }); //! sort theo bài viết mới nhất
    res.json({ posts, endCursor: posts.length > 0 ? posts[posts.length - 1].date : null }); //! lưu giá trị endCursor để sử lý bên FE
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }

}

export async function updatePost(req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      'ownerPost'
    );
    let message = '';
    if (post) {
      post.content = req.body.content;
      post.status = req.query.s;
      if (await post.save()) {
        message = 'Cập nhật thành công post';
      } else {
        message = 'Cập nhật post thất bại';
      }
      return res.json({
        message: message,
        post: post
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
}

export async function deletePost(req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.postId });
    if (post) {
      await Post.findByIdAndDelete({ _id: req.params.postId });
      return res.json({ message: 'Xóa Post thành công!' });
    } else {
      return res.json({ error: 'Post không tồn tại' });
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
}

//! Like

export async function likePost(req, res) {
  try {
    const postId = req.query.p;
    const userId = req.query.u;
    const post = await Post.findOne({ _id: postId })
    const user = await User.findOne({ _id: userId })

    if (post && user) {
      const userLiked = await Post.findOne({
        _id: postId,
        like: { $elemMatch: { idUser: userId } }
      });
      if (userLiked) {
        await Post.updateOne(
          { _id: postId },
          { $pull: { like: { idUser: userId } } }
        );

        const data = await Post.findOne({ _id: postId }).populate(
          'ownerPost'
        );
        return res.json({
          message: 'Xóa thành công like khỏi post',
          post: data
        });
      } else {
        await Post.updateOne(
          { _id: postId },
          { $push: { like: { idUser: userId } } }
        );

        const data = await Post.findOne({ _id: postId }).populate(
          'ownerPost'
        );
        return res.json({
          message: 'Thêm thành công like vào post',
          post: data
        });
      }
    } else {
      if (!post) {
        return res.json({ error: 'Có lỗi xảy ra, post không tồn tại!' });
      } else {
        return res.json({ error: 'Có lỗi xảy ra, user không tồn tại!' });
      }

    }

  } catch (err) {
    console.log(err);
    return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
}

//! Comment

export async function commentPost(req, res) {
  try {
    const comment = req.body.comment;
    const postId = req.query.p;
    const userId = req.query.u;
    const post = await Post.findOne({ _id: postId })
    const user = await User.findOne({ _id: userId })

    if (post && user) {
      await Post.updateOne(
        { _id: postId },
        { $push: { comment: { contentComment: comment } } }
      );

      const data = await Post.findOne({ _id: postId }).populate(
        'ownerPost'
      );
      return res.json({
        message: 'Thêm thành công comment',
        post: data
      });

    } else {
      if (!post) {
        return res.json({ error: 'Có lỗi xảy ra, post không tồn tại!' });
      } else {
        return res.json({ error: 'Có lỗi xảy ra, user không tồn tại!' });
      }

    }

  } catch (err) {
    console.log(err);
    return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
}