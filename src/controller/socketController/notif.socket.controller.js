import { io } from "../../../app.js";
import Notif from "../../models/notif.model.js";
import User from "../../models/user.model.js";

export async function createNotif(req, res) {
    try {
        const actionUserId = req.body.actionUserId;
        const receiverUserId = req.body.receiverUserId;
        const typeNotif = req.body.typeNotif;
        const postIdNotif = req.body.postIdNotif; //! để link đến trang post



        const actionUserCheck = await User.findById(actionUserId);
        if (actionUserCheck) {
            //! check owner cua post co thuoc member or admin page khong
            const receiverUserCheck = await User.findById(receiverUserId);
            if (receiverUserCheck) {
                //! tạo Notif moi
                const notif = new Notif({
                    actionUser: actionUserId,
                    receiverUser: receiverUserId,
                    typeNotif: typeNotif,
                    postId: postIdNotif
                });
                await notif.save();
                await User.updateOne(
                    { _id: receiverUserId },
                    {
                        $push: {
                            notifInUser: {
                                notifId: notif._id
                            }
                        }
                    }
                );

                return res.json({
                    message: 'Tao notif thanh cong',
                    notif: notif
                });

            } else {
                res.status(500).json({ message: 'receiverUserCheck khong ton tai' });

            }
        } else {


            return res.json({
                message: 'actionUserCheck khong ton tai',

            });
        }
    } catch (error) {
        console.log(error);
    }
}
export async function createNotifSocket(actionUserId, receiverUserId, typeNotif, postIdNotif, socketId) {
    try {

        console.log(1);
        const actionUserCheck = await User.findById(actionUserId);
        if (actionUserCheck) {
            //! check owner cua post co thuoc member or admin page khong
            const receiverUserCheck = await User.findById(receiverUserId);
            if (receiverUserCheck) {
                console.log(3);
                if (postIdNotif) {
                    console.log(4);
                    //! tạo Notif moi
                    const notif = new Notif({
                        actionUser: actionUserId,
                        receiverUser: receiverUserId,
                        typeNotif: typeNotif,
                        postId: postIdNotif
                    });
                    await notif.save();
                    const receiverUserFind = await User.findOne({ _id: receiverUserId }, ['socketId'])
                    const actionUserFind = await User.findOne({ _id: actionUserId }, ['fullName', 'avatarUrl'])


                    const notifSend = {
                        actionUser: actionUserFind,
                        receiverUser: receiverUserId,
                        typeNotif: typeNotif,
                        postId: postIdNotif,
                        date: notif.date,
                        _id: notif._id,
                        isSeen: false,
                    }

                    if (socketId != receiverUserFind.socketId) {

                        io.to(receiverUserFind.socketId).emit('likeNotif', notifSend);
                    }
                    await User.updateOne(
                        { _id: receiverUserId },
                        {
                            $push: {
                                notifInUser: {
                                    notifId: notif._id
                                }
                            }
                        }
                    );

                    return;
                } else {
                    //! tạo Notif moi
                    console.log(2);
                    const notif = new Notif({
                        actionUser: actionUserId,
                        receiverUser: receiverUserId,
                        typeNotif: typeNotif
                    });
                    await notif.save();
                    const receiverUserFind = await User.findOne({ _id: receiverUserId }, ['socketId'])
                    const actionUserFind = await User.findOne({ _id: actionUserId }, ['fullName', 'avatarUrl'])


                    const notifSend = {
                        actionUser: actionUserFind,
                        receiverUser: receiverUserId,
                        typeNotif: typeNotif,
                        date: notif.date,
                        _id: notif._id,
                        isSeen: false,
                    }

                    if (socketId != receiverUserFind.socketId) {

                        io.to(receiverUserFind.socketId).emit('likeNotif', notifSend);
                    }
                    await User.updateOne(
                        { _id: receiverUserId },
                        {
                            $push: {
                                notifInUser: {
                                    notifId: notif._id
                                }
                            }
                        }
                    );

                    return;
                }


            } else {
                console.log('receiverUserCheck khong ton tai');
            }
        } else {

            console.log('actionUserCheck khong ton tai');

        }
    } catch (error) {
        console.log(error);
    }
}
export async function getNotifs(req, res) {
    //! chưa xử lý trang chủ
    try {
        const after = req.query.after; // Giá trị con trỏ
        const userId = req.query.userId;
        let query = {};


        if (after) {

            //! trả về các notif có thời gian trước after, notif cũ hơn
            //! query là một đối tượng truy vấn đến DB


            const notifInUser = (await User.findById(userId)).notifInUser;
            const IdsNotifInUser = notifInUser.map(obj => obj.notifId);
            query = {
                date: { $lt: new Date(after) },
                _id: { $in: IdsNotifInUser }
            };



        } else {
            //! xử lý trường hợp chưa có after. Lần đầu tiên gọi hàm getNotifs


            //! tìm được after của notif mới nhất của user

            const notifInUser = (await User.findById(userId)).notifInUser;
            const IdsNotifInUser = notifInUser.map(obj => obj.notifId);


            query = {
                _id: { $in: IdsNotifInUser }
            };


        }

        const limit = 6;
        const notifs = await Notif.find(query).limit(limit).sort({ date: -1 }).populate({ //! chọn trường để lấy
            path: 'actionUser',
            select: 'avatarUrl fullName',
        }); //! sort theo bài viết mới nhất
        res.json({ notifs, endCursor: notifs.length > 0 ? notifs[notifs.length - 1].date : null }); //! lưu giá trị endCursor để sử lý bên FE
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }

}

export async function changeNotifType (req, res) {
    
}