import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import { sentEmail } from './email.controller.js';

//! CRUD

export async function createUser(req, res) {
  try {
    const userCheck = await User.findOne({ userName: req.body.userName });
    const emailCheck = await User.findOne({ email: req.body.email });
    if (userCheck) {
      return res.json({
        message: `User ${req.body.userName} exists already`
      });
    } else if (emailCheck) {
      return res.json({
        message: `Email ${req.body.email} exists already`
      });
    } else {
      const generateRandomToken = () => {
        return crypto.randomBytes(20).toString('hex');
      };
      const token = generateRandomToken();
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        userName: req.body.userName,
        fullName: req.body.fullName,
        password: hashedPassword,
        email: req.body.email,
        tokenAuthEmail: token
      });
      if (await user.save()) {
        const content = `Hello http://localhost:3000/users/confirmEmail/${token}`;
        //! gửi email xác thực người dùng
        sentEmail(
          req.body.email,
          'Xác nhận tài khoản',
          content
        )
          .then(() => {
            console.log('sent successful');
          })
          .catch((err) => console.log(err));
        return res.json({ success: 'Tạo thành công người dùng' });
      } else {
        return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
}

export async function checkUserExisted(req, res) {
  try {
    const userId = req.body.userId

    if ((req.body.userName == req.body.userNameCurrent || req.body.email == req.body.emailCurrent)) {
      if (req.body.userName == req.body.userNameCurrent && req.body.email == req.body.emailCurrent) {
        //! cả 2 đều trùng const userId = req.body.userId
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              ...(req.body.bio && { bio: req.body.bio }),
              ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.userName && { userName: req.body.userName }),
              ...(req.body.email && { email: req.body.email }),
              ...(req.body.fullName && { fullName: req.body.fullName }),
              ...(req.body.birthday && { birthday: req.body.birthday }),
              ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
            }
          }
        );
        const userUpdate = await User.findById(userId).select('userName fullName avatarUrl birthday phoneNumber bio email authEmail')
        console.log(userUpdate, 11);
        return res.json({
          message: `Update successfully`,
          userUpdate: userUpdate
        });
      } else if (req.body.userName != req.body.userNameCurrent && req.body.email == req.body.emailCurrent) {
        //! có email là trùng, phải check userName
        const userCheck = await User.findOne({ userName: req.body.userName }).select('userName');
        if (!userCheck) { //! không có user như vậy
          const userId = req.body.userId
          await User.updateOne(
            { _id: userId },
            {
              $set: {
                ...(req.body.bio && { bio: req.body.bio }),
                ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.userName && { userName: req.body.userName }),
              ...(req.body.email && { email: req.body.email }),
                ...(req.body.fullName && { fullName: req.body.fullName }),
                ...(req.body.birthday && { birthday: req.body.birthday }),
                ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
              }
            }
          );
  
          const userUpdate = await User.findById(userId).select('userName fullName avatarUrl birthday phoneNumber bio email authEmail')
          console.log(userUpdate, 11);
          return res.json({
            message: `Update successfully`,
            userUpdate: userUpdate
          });
        }  else {
          return res.json({
            message: `User ${req.body.userName} exists already`,
          });
        }
      } else if (req.body.userName == req.body.userNameCurrent && req.body.email != req.body.emailCurrent) {
        //! có userName là trùng
        const emailCheck = await User.findOne({ email: req.body.email }).select('userName');

        if (!emailCheck) { //! không có user có email như vậy
          const userId = req.body.userId
          await User.updateOne(
            { _id: userId },
            {
              $set: {
                ...(req.body.bio && { bio: req.body.bio }),
                ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.userName && { userName: req.body.userName }),
              ...(req.body.email && { email: req.body.email }),
                ...(req.body.fullName && { fullName: req.body.fullName }),
                ...(req.body.birthday && { birthday: req.body.birthday }),
                ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
              }
            }
          );
  
          const userUpdate = await User.findById(userId).select('userName fullName avatarUrl birthday phoneNumber bio email authEmail')
          console.log(userUpdate, 11);
          return res.json({
            message: `Update successfully`,
            userUpdate: userUpdate
          });
        }  else {
          return res.json({
            message: `Email ${req.body.email} exists already`,

          });
        }
      }



    } else { //! TRƯỜNG HỢP USERNAME VÀ EMAIL KHÔNG TRÙNG VỚI EMAIL USERNAME CŨ 
      const userCheck = await User.findOne({ userName: req.body.userName }).select('userName');
      const emailCheck = await User.findOne({ email: req.body.email }).select('userName');
      console.log(userCheck);
      console.log(emailCheck);
      if (!userCheck && !emailCheck) {
        console.log(1);
        const userId = req.body.userId
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              ...(req.body.bio && { bio: req.body.bio }),
              ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.userName && { userName: req.body.userName }),
              ...(req.body.email && { email: req.body.email }),
              ...(req.body.fullName && { fullName: req.body.fullName }),
              ...(req.body.birthday && { birthday: req.body.birthday }),
              ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
            }
          }
        );

        const userUpdate = await User.findById(userId).select('userName fullName avatarUrl birthday phoneNumber bio email authEmail')
        console.log(userUpdate, 11);
        return res.json({
          message: `Update successfully`,
          userUpdate: userUpdate
        });
      } else if (userCheck && !emailCheck) {
        console.log(2);

        const userId = req.body.userId
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              ...(req.body.bio && { bio: req.body.bio }),
              ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.email && { email: req.body.email }),
              ...(req.body.fullName && { fullName: req.body.fullName }),
              ...(req.body.birthday && { birthday: req.body.birthday }),
              ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
            }
          }
        );

        const userUpdate = await User.findById(userId).select('userName fullName avatarUrl birthday phoneNumber bio email authEmail')
        console.log(userUpdate, 11);
        return res.json({
          message: `User ${req.body.userName} exists already`,
          message1: `Update successfully`,
          userUpdate: userUpdate
        });
      } else if (!userCheck && emailCheck) {
        console.log(3);

        const userId = req.body.userId
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              ...(req.body.bio && { bio: req.body.bio }),
              ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.userName && { userName: req.body.userName }),
              ...(req.body.fullName && { fullName: req.body.fullName }),
              ...(req.body.birthday && { birthday: req.body.birthday }),
              ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
            }
          }
        );

        const userUpdate = await User.findById(userId).select('userName fullName avatarUrl birthday phoneNumber bio email authEmail')
        console.log(userUpdate, 11);
        return res.json({
          message: `User ${req.body.email} exists already`,
          message1: `Update successfully`,
          userUpdate: userUpdate
        });
      } else if (userCheck && emailCheck) {
        console.log(4);

        const userId = req.body.userId
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              ...(req.body.bio && { bio: req.body.bio }),
              ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
              ...(req.body.fullName && { fullName: req.body.fullName }),
              ...(req.body.birthday && { birthday: req.body.birthday }),
              ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber })
            }
          }
        );

        const userUpdate = await User.findById(userId).select('userName fullName avatarUrl birthday phoneNumber bio email authEmail')
        console.log(userUpdate, 11);
        return res.json({
          message: `User ${req.body.userName} exists already`,
          message1: `Update successfully`,
          userUpdate: userUpdate
        });
      }

    }


  } catch (err) {
    console.log(err);
    return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
}

export function getUsers(req, res) {
  console.log("getUsers");
}

export async function getUser(req, res) {
  const userId = req.params.userId
  try {
    const user = await User.findById({
      _id: userId
    }, ['_id', 'fullName', 'avatarUrl', 'listFriends']);
    console.log(user);
    res.json({
      message: 'User info',
      user: user
    });
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Something wrong' });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = req.params.userId
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          ...(req.body.bio && { bio: req.body.bio }),
          ...(req.body.avatarUrl && { avatarUrl: req.body.avatarUrl }),
          ...(req.body.fullName && { fullName: req.body.fullName })
        }
      }
    );
    return res.json({ message: 'Update thành công' });
  } catch (err) {
    return res.json({ message: 'Bạn cần đăng nhập trước đã' });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.userId
    await User.deleteOne(
      { _id: userId }
    );
    return res.json({ message: 'Delete thành công User' });
  } catch (err) {
    return res.json({ message: 'Co loi xay ra' });
  }
}

export async function searchUsersByKeyword(req, res) {
  const keyword = req.query.keyword;


  try {
    // Sử dụng $regex để tìm kiếm tương đối
    const users = await User.find({
      fullName: {
        $regex: keyword, // Sử dụng keyword như biểu thức chính quy
        $options: 'i', // Tùy chọn 'i' để không phân biệt hoa thường
      },
    }, ['_id', 'fullName', 'avatarUrl']);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi trong quá trình tìm kiếm người dùng.' });
  }



}

//! login logout
export async function login(req, res) {
  try {
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) {
      return res.json({
        message: `User ${req.body.userName} is not exist`
      });
    } else {
      const hashedPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (hashedPassword) {
        const payload = { userName: req.body.userName };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        const userData = {
          _id: user._id,
          userName: user.userName,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          birthday: user.birthday,
          phoneNumber: user.phoneNumber,
          bio: user.bio,
          email: user.email,
          authEmail: user.authEmail,
        };

        return res.json({
          accessToken,
          userData,
          success: 'Login successful'
        });
      } else {
        return res.json({
          message: 'Password is wrong'
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: 'Something error' });
  }
}

export function logout(req, res) {
  console.log("logout");
}


//! password

export async function updatePassword(req, res) {
  const userId = req.params.userId
  console.log(userId);
  console.log(req.body.password);
  
  try {
    const user = await User.findOne({
      _id: userId
    });

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (comparePassword) {
      if (req.body.newPassword !== req.body.checkNewPassword) {
        return res.json({ message: 'Mật khẩu mới không trùng nhau' });

      } else {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        await User.updateOne(
          { _id: userId },
          {
            $set: {
              ...(req.body.password && { password: hashedPassword })
            }
          }
        );
        return res.json({ message: 'Mật khẩu đã được cập nhật' });
      }
    } else {
      return res.json({ message: 'Mật khẩu cũ không đúng' });
    }

  } catch (error) {
    return res.json({ message: 'Bạn cần đăng nhập trước đã' });
  }
}

export async function sentNewPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ message: 'Email không tồn tại trong hệ thống' });
    } else {
      const generateRandomToken = () => {
        return crypto.randomBytes(10).toString('hex');
      };
      const token = generateRandomToken();
      const hashedPassword = await bcrypt.hash(token, 10);
      user.password = hashedPassword;
      user
        .save()
        .then((savedUser) => {
          console.log('User saved:', savedUser);
        })
        .catch((error) => {
          console.error('Error saving user:', error);
        });
      const content = `Password mới của tài khoản ${user.userName} là: ${token}
        Vui lòng đổi mật khẩu tại đây....`;
      //! gửi email xác thực người dùng
      sentEmail(req.body.email, 'Xác nhận tài khoản', content)
        .then(() => {
          console.log('sent successful');
        })
        .catch((err) => console.log(err));
      return res.json({ success: 'Đã gửi email reset mật khẩu thành công' });
    }
  } catch (error) {
    return res.json({ message: 'Có lỗi xảy ra' });
  }
}

//! email

export async function confirmEmail(req, res) {
  try {
    const user = await User.findOne({ tokenAuthEmail: req.params.token });
    user.authEmail = true;
    user
      .save()
      .then((savedUser) => {
        console.log('User saved:', savedUser);
      })
      .catch((error) => {
        console.error('Error saving user:', error);
      });
    console.log(user);
    const htmlResponse = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Xác nhận tài khoản</title>
          </head>
          <body>
            <h1>Xác nhận tài khoản</h1>
            <p>Bạn đã xác nhận email ${user.email} liên kết với tài khoản ${user.userName} thành công. Cảm ơn bạn và chúc bạn một ngày tốt lành!</p>
          </body>
        </html>
   `;
    return res.send(htmlResponse);
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Có lỗi xảy ra' });
  }
}

//! search
export function search(req, res) {
  console.log("search");
}


//! SOCKET
//! hàm sử lý socketID
export async function saveSocketIdToUser(userId, socketId) {
  try {
    console.log(userId, "socketId" + socketId);
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          socketId: socketId
        }
      }
    );

  } catch (err) {
  }
}
export async function resetSocketIdToUser(userId) {
  try {
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          socketId: ''
        }
      }
    );

  } catch (err) {
  }
}





