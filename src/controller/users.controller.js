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

export function getUsers(req, res) {
    console.log("getUsers");
}

export async function getUser(req, res) {
    const userId = req.params.userId
    try {
      const user = await User.findById({
        _id: userId
      });
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

//! login logout
export async function login(req, res) {
    try {
      const user = await User.findOne({ userName: req.body.userName });
      if (!user) {
        return res.json({
          message: `Không tồn tại người dùng với username: ${req.body.userName}`
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
            bio: user.bio,
            email: user.email,
            authEmail: user.authEmail,
          };

          return res.json({
            accessToken,
            userData,
            success: 'Đăng nhập thành công!'
          });
        } else {
          return res.json({
            message: 'Nhập khẩu vừa nhập vào không chính xác'
          });
        }
      }
    } catch (err) {
      console.log(err);
      return res.json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
  }

export function logout(req, res) {
    console.log("logout");
}


//! password

export async function updatePassword(req, res) {
    const userId = req.params.userId

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






