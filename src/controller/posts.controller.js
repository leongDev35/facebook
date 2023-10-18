import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Page from "../models/page.model.js";
import { request, response } from "express";
import Comment from "../models/commentPost.model.js";

//! CRUD

export async function createPost(req, res) {
  try {
    const ownerId = req.body.ownerId;
    const pageId = req.body.pageId;

    const pageIdCheck = await Page.findById(pageId);
    if (pageIdCheck) {
      //! check owner cua post co thuoc member or admin page khong
      const ownerPostCheck = await Page.findOne({
        _id: pageId,
        $or: [{ ownerPage: ownerId }, { 'member.idUser': ownerId }] //! query obj trong 1 mang ma mang lai la thuoc tinh cua Schema
      })
      if (ownerPostCheck) {
        //! tạo post trong page. 
        const post = new Post({
          content: req.body.content,
          contentImage: req.body.contentImage,
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
        res.status(500).json({ message: 'Ban khong phai member cua Page nay' });

      }
    } else if (pageId == ownerId) {

      const post = new Post({
        content: req.body.content,
        contentImage: req.body.contentImage,
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
  } catch (error) {
    console.log(error);
  }
}
export async function getPost(req, res) {
  //! chưa xử lý trang chủ
  try {
    const postId = req.query.postId; 
        const post = await Post.findById(postId).populate({ //! chọn trường để lấy
          path: 'ownerPost',
          select: 'avatarUrl fullName',
        });
        
    res.json({ post }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching posts' });
  }

}
export async function getPosts(req, res) {
  //! chưa xử lý trang chủ
  try {
    const after = req.query.after; // Giá trị con trỏ
    const userId = req.query.userId;
    const pageId = req.query.pageId;
    let query = {};


    if (after) {

      //! trả về các bài post có thời gian trước after, bài cũ hơn
      //! query là một đối tượng truy vấn đến DB
      if (pageId == userId && userId) { //! trang của từng user
        

        const postInUser = (await User.findById(userId)).postInProfile;
        const IdsPostInUser = postInUser.map(obj => obj.postId); //! Lấy post của User
        query = {
          date: { $lt: new Date(after) },
          _id: { $in: IdsPostInUser }
        };
        
      } else if (pageId != userId) { //! trang của page id
        query = {
          date: { $lt: new Date(after) }
        };
      } else if (!pageId) { //! trang chủ
        query = {
          date: { $lt: new Date(after) }
        };
      }

    } else {
      //! xử lý trường hợp chưa có after. Lần đầu tiên gọi hàm getPosts
      if (!pageId) {
        //! trang chủ
        


      } else if (pageId == userId) { //! trang của từng user, chưa làm trang newfeed
        //! tìm được after của bài viết mới nhất của user

        const postInUser = (await User.findById(userId)).postInProfile;
        const IdsPostInUser = postInUser.map(obj => obj.postId); //! Lấy post của User

        query = {
          _id: { $in: IdsPostInUser }
        };
      } else if (pageId != userId) { //! các page có id page riêng
        const postsInPage = (await Page.findById(pageId)).postsInPage;
        const idsPostsInPage = postsInPage.map(obj => obj.postId); //! Lấy post của User
        query = {
          _id: { $in: idsPostsInPage }
        };
      }

    }

    const limit = 6;
    const posts = await Post.find(query).limit(limit).sort({ date: -1 }).populate({ //! chọn trường để lấy
      path: 'ownerPost',
      select: 'avatarUrl fullName',
    }); //! sort theo bài viết mới nhất
    res.json({ posts, endCursor: posts.length > 0 ? posts[posts.length - 1].date : null }); //! lưu giá trị endCursor để sử lý bên FE
  } catch (error) {
    console.log(error);
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
    const postId = req.query.postId;
    const pageId = req.query.pageId;

    const post = await Post.findOne({ _id: postId });
    console.log(post);
    if (post) {
      if (post.pageId) {
        console.log(post.pageId);
        await User.updateOne(
          { _id: post.ownerPost },
          {
            $pull: {
              postsInPage: {
                postId: post._id
              }
            }
          }
        );
        await Page.updateOne(
          { _id: post.pageId },
          {
            $pull: {
              postsInPage: {
                postId: post._id
              }
            }
          }
        );
      } else {
        await User.updateOne(
          { _id: post.ownerPost },
          {
            $pull: {
              postInProfile: {
                postId: post._id
              }
            }
          }
        );
      }
      await Post.findByIdAndDelete({ _id: postId });
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

        const data = await Post.findOne({ _id: postId }).populate({ //! chọn trường để lấy
          path: 'ownerPost',
          select: 'avatarUrl fullName',
        });
        return res.json({
          message: 'Xóa thành công like khỏi post',
          post: data
        });
      } else {
        await Post.updateOne(
          { _id: postId },
          { $push: { like: { idUser: userId } } }
        );

        const data = await Post.findOne({ _id: postId }).populate({ //! chọn trường để lấy
          path: 'ownerPost',
          select: 'avatarUrl fullName',
        });
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
export async function likePostSocket(p, u) {
  try {
    const postId = p;
    const userId = u;
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

        const data = await Post.findOne({ _id: postId }).populate({ //! chọn trường để lấy
          path: 'ownerPost',
          select: 'avatarUrl fullName',
        });
        return {data: data, type: 'unlike'}
      } else { //! trường hợp thêm like vào bài post
        await Post.updateOne(
          { _id: postId },
          { $push: { like: { idUser: userId } } }
        );

        const data = await Post.findOne({ _id: postId }).populate({ //! chọn trường để lấy
          path: 'ownerPost',
          select: 'avatarUrl fullName',
        });


        return {data: data, type: 'like'}
      }
    } else {
      if (!post) {
        console.log('Có lỗi xảy ra, post không tồn tại!');
      } else {
        console.log({ error: 'Có lỗi xảy ra, user không tồn tại!' });
      }

    }

  } catch (err) {
    console.log(err);

  }
}

//! Comment- DOING
//! tạo một comment cho Post
export async function commentPost(req, res) {
  try {
    const contentComment = req.body.comment;
    const postId = req.query.p;
    const userId = req.query.u;
    const post = await Post.findOne({ _id: postId })
    const user = await User.findOne({ _id: userId })
    let query = {};
    if (post && user) {

      const comment = new Comment({
        contentComment: contentComment,
        idUserComment: userId,
      })

      await comment.save()
      // await Comment.
      await Post.updateOne(
        { _id: postId },
        { $push: { comment: { idComment: comment._id } } }
      );

      const data = await Post.findOne({ _id: postId }).populate({ //! chọn trường để lấy
        path: 'ownerPost',
        select: 'avatarUrl fullName',
      })
      const commentsInPost = data.comment;
      console.log(commentsInPost);
      const IdsCommentsInPost = commentsInPost.map(obj => obj.idComment); //! Lấy comment của post
      query = {
        _id: { $in: IdsCommentsInPost }
      };
      const limit = 3;
      const comments = await Comment.find(query).limit(limit).sort({ date: -1 }).populate({ //! chọn trường để lấy
        path: 'idUserComment',
        select: 'avatarUrl fullName',
      }); //! sort theo bài viết mới nhất
      return res.json({ comments });

      // .populate(
      //   {
      //     path: 'comment.idComment',
      //     // populate: { //! lồng populate vào populate để lấy user comment
      //     //   path: 'idUserComment',
      //     //   select: 'avatarUrl fullName'
      //     // }
      //   }
      // );
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
export async function commentPostSocket(p, u, comment) {
  try {
    const contentComment = comment;
    const postId = p;
    const userId = u;
    const post = await Post.findOne({ _id: postId })
    const user = await User.findOne({ _id: userId })
    let query = {};
    if (post && user) {

      const comment = new Comment({
        contentComment: contentComment,
        idUserComment: userId,
      })

      await comment.save()
      // await Comment.
      await Post.updateOne(
        { _id: postId },
        { $push: { comment: { idComment: comment._id } } }
      );

      const data = await Post.findOne({ _id: postId }).populate({ //! chọn trường để lấy
        path: 'ownerPost',
        select: 'avatarUrl fullName',
      })
      const commentsInPost = data.comment;
      const IdsCommentsInPost = commentsInPost.map(obj => obj.idComment); //! Lấy comment của post
      query = {
        _id: { $in: IdsCommentsInPost }
      };
      const limit = 3;
      const comments = await Comment.find(query).limit(limit).sort({ date: -1 }).populate({ //! chọn trường để lấy
        path: 'idUserComment',
        select: 'avatarUrl fullName',
      }); //! sort theo bài viết mới nhất
      return {comments: comments, data: data};


    } else {
      if (!post) {
        console.log({ error: 'Có lỗi xảy ra, post không tồn tại!' });
      } else {
        console.log({ error: 'Có lỗi xảy ra, user không tồn tại!' });
      }

    }

  } catch (err) {
    console.log(err);
  }
}

//! xóa 1 comment trong Post
export async function deleteCommentPost(req, res) {
  try {
    const commentId = req.query.c;
    const postId = req.query.p;
    const userId = req.query.u;
    const comment = await Comment.findOne({ _id: commentId })
    console.log(comment.idUserComment.toString());
    console.log(userId);
    //! xác thực xem người dùng có phải chủ của comment không
    if (!(comment.idUserComment.toString() == userId)) {
      return res.json({ message: 'User is not owner' });
    } else {
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            comment: {
              idComment: commentId
            }
          }
        }
      );
      await Comment.deleteOne({ _id: commentId });
      return res.json({ message: 'Delete complete' });
    }

  } catch (err) {
    console.log(err);
    return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
}
//! lấy comment từ một post
export async function getComments(req, res) {
  //! chưa xử lý trang chủ
  try {
    const after = req.query.after; // Giá trị con trỏ
    const postId = req.query.postId;
    let query = {};

    if (after) {

      //! trả về các bài post có thời gian trước after, bài cũ hơn
      //! query là một đối tượng truy vấn đến DB

      const commentsInPost = (await Post.findById(postId)).comment;
      console.log(commentsInPost);
      const IdsCommentsInPost = commentsInPost.map(obj => obj.idComment); //! Lấy comment của post
      query = {
        date: { $lt: new Date(after) },
        _id: { $in: IdsCommentsInPost }
      };
    } else {
      //! xử lý trường hợp chưa có after. Lần đầu tiên gọi hàm getComments

      const commentsInPost = (await Post.findById(postId)).comment;
      const IdsCommentsInPost = commentsInPost.map(obj => obj.idComment);

      query = {
        _id: { $in: IdsCommentsInPost }
      };

    }

    const limit = 3;
    const comments = await Comment.find(query).limit(limit).sort({ date: -1 }).populate({ //! chọn trường để lấy
      path: 'idUserComment',
      select: 'avatarUrl fullName',
    }); //! sort theo bài viết mới nhất
    res.json({ comments, endCursor: comments.length > 0 ? comments[comments.length - 1].date : null }); //! lưu giá trị endCursor để sử lý bên FE
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching Comments' });
  }

}