import Post from "../models/post.model.js";
import User from "../models/user.model.js";

//! CRUD

export async function createPost(req, res) {
    try {
        const post = new Post({
            content: req.body.content,
            owner: req.body.ownerId
          });
          await post.save();

          await User.updateOne(
            { _id: req.body.ownerId },
            { $push: { posts: { postId: post._id } } }
          );
          return res.json({
            message: 'Tạo post thành công',
            post: post
          });
    } catch (error) {
        console.log(error);
    }
}

export async function getPosts(req, res) {
      
        try {
        const after = req.query.after; // Giá trị con trỏ

          let query = {};
          if (after) {
            //! trả về các bài post có thời gian trước after, bài cũ hơn
            //! query là một đối tượng truy vấn đến DB
            query = { date: { $lt: new Date(after) } }; //! tìm date giá trị nhỏ hơn after. Tức các bài viết cũ hơn giá trị after
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
      'owner'
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

    if (post && user ) {
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
          'owner'
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
          'owner'
        );
        return res.json({
          message: 'Thêm thành công like vào post',
          post: data
        });
      }
    } else {
      if(!post) {
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

    if (post && user ) {
        await Post.updateOne(
          { _id: postId },
          { $push: { comment: { contentComment: comment } } }
        );

        const data = await Post.findOne({ _id: postId }).populate(
          'owner'
        );
        return res.json({
          message: 'Thêm thành công comment',
          post: data
        });
      
    } else {
      if(!post) {
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