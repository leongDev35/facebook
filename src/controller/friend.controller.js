//! CRUD

import User from "../models/user.model.js";

//! Gửi lời mời kết bạn 

export async function sendFriendRequest(req, res) {

    try {
        const idSender = req.body.idSender;
        const idReceiver = req.body.idReceiver;


        const notifSend = {
            actionUser: idSender,
            receiverUser: idReceiver,
            typeNotif: "friend"
        }



        //! for Sender: Lưu vào listSentFriendRequests,listMeFollows
        //! xét xem có userId đấy trong listSentFriendRequests chưa

        const user = await User.findById({
            _id: idSender
        });

        const isReceiverExistInListSentFriendRequests = user.listSentFriendRequests.some(obj => obj.userId.toString() === idReceiver);
        const isReceiverExistInListMeFollows = user.listMeFollows.some(obj => obj.userId.toString() === idReceiver);
        const isReceiverExistInListFriends = user.listFriends.some(obj => obj.userId.toString() === idReceiver);
        const isReceiverExistInListFriendsSentRequest = user.listFriendsSentRequest.some(obj => obj.userId.toString() === idReceiver);

        if (isReceiverExistInListFriends) {
            console.log("Friend đã tồn tại trong list Friends nên không thể add lại");
        } else if (isReceiverExistInListFriendsSentRequest) {
            console.log("Friend đã gửi lời mời kết bạn cho bạn, bạn hãy đồng ý or từ chối, không thể add lại");
            
        } else {
            if (isReceiverExistInListSentFriendRequests) {
                console.log("Friend đã tồn tại trong listSentFriendRequests");
            } else {
                await User.updateOne(
                    { _id: idSender },
                    {
                        $push: { //! addToSet sẽ check 
                            listSentFriendRequests: {
                                userId: idReceiver,
                            }
                        }
                    }
                );
                console.log("cập nhật Friend trong list FriendRequest");
            }
            if (isReceiverExistInListMeFollows) {
                console.log("Friend đã tồn tại trong  listMeFollows");
            } else {
                await User.updateOne(
                    { _id: idSender },
                    {
                        $push: { //! addToSet sẽ check 
                            listMeFollows: {
                                userId: idReceiver,
                            }
                        }
                    }
                );
                console.log("cập nhật Friend trong listMeFollows");
            }

        }
        //! for Receiver: Lưu vào listFollowsMe,listFriendsSentRequest
        const userReceiver = await User.findById({
            _id: idReceiver
        });


        const isSenderExistInListSentFriendRequests = userReceiver.listSentFriendRequests.some(obj => obj.userId.toString() === idSender);

        const isSenderExistInlistFollowsMe = userReceiver.listFollowsMe.some(obj => obj.userId.toString() === idSender);
        const isSenderExistInlistFriendsSentRequest = userReceiver.listFriendsSentRequest.some(obj => obj.userId.toString() === idSender);
        const isSenderExistInListFriends = userReceiver.listFriends.some(obj => obj.userId.toString() === idSender);

        if (isSenderExistInListFriends) {
            console.log("Sender đã tồn tại trong list Friends của người nhận nên không thể add lại");
        } else if (isSenderExistInListSentFriendRequests) {
            console.log("Sender đã gửi lời mời kết bạn đến cho Receiver, không thể add lại");
            
        }  else { 
             if (isSenderExistInlistFollowsMe) {
            console.log("Friend đã tồn tại trong listFollowsMe");
        } else {
            await User.updateOne(
                { _id: idReceiver },
                {
                    $push: { //! addToSet sẽ check 
                        listFollowsMe: {
                            userId: idSender,
                        }
                    }
                }
            );
            console.log("cập nhật Friend trong listFollowsMe");
        }
        if (isSenderExistInlistFriendsSentRequest) {
            console.log("Friend đã tồn tại trong  listFriendsSentRequest");
        } else {
            await User.updateOne(
                { _id: idReceiver },
                {
                    $push: { //! addToSet sẽ check 
                        listFriendsSentRequest: {
                            userId: idSender,
                        }
                    }
                }
            );
            console.log("cập nhật Friend trong listFriendsSentRequest");
        }
    }


        return res.json({
            message: 'Gửi Friend Request thành công ',

        });

    } catch (error) {
        console.log(error);
    }

}

export async function sendFriendRequestSocket(idSender, idReceiver) {

    try {
      


        const notifSend = {
            actionUser: idSender,
            receiverUser: idReceiver,
            typeNotif: "friend"
        }

        

        //! for Sender: Lưu vào listSentFriendRequests,listMeFollows
        //! xét xem có userId đấy trong listSentFriendRequests chưa

        const user = await User.findById({
            _id: idSender
        });

        const isReceiverExistInListSentFriendRequests = user.listSentFriendRequests.some(obj => obj.userId.toString() === idReceiver);
        const isReceiverExistInListMeFollows = user.listMeFollows.some(obj => obj.userId.toString() === idReceiver);
        const isReceiverExistInListFriends = user.listFriends.some(obj => obj.userId.toString() === idReceiver);
        const isReceiverExistInListFriendsSentRequest = user.listFriendsSentRequest.some(obj => obj.userId.toString() === idReceiver);

        if (isReceiverExistInListFriends) {
            console.log("Friend đã tồn tại trong list Friends nên không thể add lại");
        } else if (isReceiverExistInListFriendsSentRequest) {
            console.log("Friend đã gửi lời mời kết bạn cho bạn, bạn hãy đồng ý or từ chối, không thể add lại");
            
        } else {
            if (isReceiverExistInListSentFriendRequests) {
                console.log("Friend đã tồn tại trong listSentFriendRequests");
            } else {
                await User.updateOne(
                    { _id: idSender },
                    {
                        $push: { //! addToSet sẽ check 
                            listSentFriendRequests: {
                                userId: idReceiver,
                            }
                        }
                    }
                );
                console.log("cập nhật Friend trong list FriendRequest");
            }
            if (isReceiverExistInListMeFollows) {
                console.log("Friend đã tồn tại trong  listMeFollows");
            } else {
                await User.updateOne(
                    { _id: idSender },
                    {
                        $push: { //! addToSet sẽ check 
                            listMeFollows: {
                                userId: idReceiver,
                            }
                        }
                    }
                );
                console.log("cập nhật Friend trong listMeFollows");
            }

        }
        //! for Receiver: Lưu vào listFollowsMe,listFriendsSentRequest
        const userReceiver = await User.findById({
            _id: idReceiver
        });


        const isSenderExistInListSentFriendRequests = userReceiver.listSentFriendRequests.some(obj => obj.userId.toString() === idSender);

        const isSenderExistInlistFollowsMe = userReceiver.listFollowsMe.some(obj => obj.userId.toString() === idSender);
        const isSenderExistInlistFriendsSentRequest = userReceiver.listFriendsSentRequest.some(obj => obj.userId.toString() === idSender);
        const isSenderExistInListFriends = userReceiver.listFriends.some(obj => obj.userId.toString() === idSender);

        if (isSenderExistInListFriends) {
            console.log("Sender đã tồn tại trong list Friends của người nhận nên không thể add lại");
        } else if (isSenderExistInListSentFriendRequests) {
            console.log("Sender đã gửi lời mời kết bạn đến cho Receiver, không thể add lại");
            
        }  else { 
             if (isSenderExistInlistFollowsMe) {
            console.log("Friend đã tồn tại trong listFollowsMe");
        } else {
            await User.updateOne(
                { _id: idReceiver },
                {
                    $push: { //! addToSet sẽ check 
                        listFollowsMe: {
                            userId: idSender,
                        }
                    }
                }
            );
            console.log("cập nhật Friend trong listFollowsMe");
        }
        if (isSenderExistInlistFriendsSentRequest) {
            console.log("Friend đã tồn tại trong  listFriendsSentRequest");
        } else {
            await User.updateOne(
                { _id: idReceiver },
                {
                    $push: { //! addToSet sẽ check 
                        listFriendsSentRequest: {
                            userId: idSender,
                        }
                    }
                }
            );
            console.log("cập nhật Friend trong listFriendsSentRequest");
        }
    }

    
        console.log('Gửi Friend Request thành công ');
       

    } catch (error) {
        console.log(error);
    }

}

//! Đồng ý or từ chối lời mời kết bạn
export async function responseFriendRequest(req, res) {
    try {
        const senderFriendRequestId = req.body.senderId;
        const response = req.body.response;
        const userId = req.body.userId;

        
        const user = await User.findById({
            _id: userId
        });
        const sender = await User.findById({
            _id: senderFriendRequestId
        });
        //! check người gửi có trong list các người gửi Req của user không
        const isSenderExistInlistFriendsSentRequest = user.listFriendsSentRequest.some(obj => obj.userId.toString() === senderFriendRequestId);
        const isSenderExistInlistFriends = user.listFriends.some(obj => obj.userId.toString() === senderFriendRequestId);

        //! check user có trong list người được gửi Req của Sender không
        const isUserExistInlistSentFriendRequests = sender.listSentFriendRequests.some(obj => obj.userId.toString() === userId);
        const isUserExistInlistFriends = sender.listFriends.some(obj => obj.userId.toString() === userId);


        if (response == 'accept') {
            //! cập nhật user
            if (!isSenderExistInlistFriendsSentRequest || isSenderExistInlistFriends) {
                if (!isSenderExistInlistFriendsSentRequest) {
                    console.log("Sender không tồn tại trong  listFriendsSentRequest của User");

                } else {
                    console.log("Sender tồn tại trong  listFriends của User");
                }
            } else if (isSenderExistInlistFriends) {
                console.log("Error: sender tồn tại trong listFriends nên không thể push vào");

            } else if (!isSenderExistInlistFriendsSentRequest) {
                console.log("Error: Sender không tồn tại trong  listFriendsSentRequest của User nên không thể pull ra");

            } else {

                await User.updateOne(
                    { _id: userId },
                    {
                        $pull: {
                            listFriendsSentRequest: {
                                userId: senderFriendRequestId,
                            }

                        },
                        $push: {
                            listFriends: {
                                userId: senderFriendRequestId,
                            },
                            listMeFollows: {
                                userId: senderFriendRequestId,
                            },
                        },

                    }
                );


            }
            //! cập nhật sender
            if (!isUserExistInlistSentFriendRequests || isUserExistInlistFriends) {
                if (!isUserExistInlistSentFriendRequests) {
                    console.log("User không tồn tại trong  listFriendsSentRequest của Sender");

                } else {
                    console.log("User tồn tại trong  listFriends của Sender");
                }
            } else if (isUserExistInlistFriends) {
                console.log("Error: User tồn tại trong listFriends của Sender nên không thể push vào");

            } else if (!isUserExistInlistSentFriendRequests) {
                console.log("Error: User không tồn tại trong  listSentFriendRequests của Sender nên không thể pull ra");

            } else {

                await User.updateOne(
                    { _id: senderFriendRequestId },
                    {
                        $pull: {
                            listSentFriendRequests: {
                                userId: userId,
                            }
                        },
                        $push: {
                            listFriends: {
                                userId: userId,
                            },
                            listFollowsMe: {
                                userId: userId,
                            }
                        }
                    }
                );


            }
            return res.json({
                message: 'Accept Friend Request thành công ',
            });

        } else if (response == 'reject') {
            //! cập nhật user
            if (!isSenderExistInlistFriendsSentRequest) {
                console.log("Error: Sender không tồn tại trong  listFriendsSentRequest của User nên không thể pull ra");

            } else {

                await User.updateOne(
                    { _id: userId },
                    {
                        $pull: {
                            listFriendsSentRequest: {
                                userId: senderFriendRequestId,
                            }
                        }
                    }
                );


            }
            //! cập nhật sender
            if (!isUserExistInlistSentFriendRequests) {
                console.log("Error: User không tồn tại trong  listSentFriendRequests của Sender nên không thể pull ra");

            } else {

                await User.updateOne(
                    { _id: senderFriendRequestId },
                    {
                        $pull: {
                            listSentFriendRequests: {
                                userId: userId,
                            }
                        }
                    }
                );


            }
            return res.json({
                message: 'Reject  Friend Request thành công ',
            });


        }
    } catch (error) {
        console.log(error);
    }

}

//! Xóa bạn bè đồng thời cũng xóa follow
export async function deleteFriend(req, res) {
    try {
        const userId = req.query.userId;
        const friendId = req.query.friendId;

        const user = await User.findById({
            _id: userId
        });
        const friend = await User.findById({
            _id: friendId
        });
        //! check người gửi có trong list các người gửi Req của user không
        const isFriendExistInlistFriends = user.listFriends.some(obj => obj.userId.toString() === friendId);
        const isFriendExistInlistMeFollows = user.listMeFollows.some(obj => obj.userId.toString() === friendId);

        //! check user có trong list người được gửi Req của Sender không
        const isUserExistInlistFriends = friend.listFriends.some(obj => obj.userId.toString() === userId);
        const isUserExistInlistMeFollows = friend.listMeFollows.some(obj => obj.userId.toString() === userId);

        //! cập nhật user
        if (!isFriendExistInlistFriends) {
            console.log("Error: Friend không tồn tại trong  listFriends của User nên không thể pull ra");

        } else if (!isFriendExistInlistMeFollows) {
            console.log("Error: Friend không tồn tại trong  listMeFollows của User nên không thể pull ra");
        } else {

            await User.updateOne(
                { _id: userId },
                {
                    $pull: {
                        listFriends: {
                            userId: friendId,
                        },
                        listMeFollows: {
                            userId: friendId,
                        },
                        listFollowsMe: {
                            userId: friendId,
                        },

                    }
                }
            );


        }
        //! cập nhật friend
        if (!isUserExistInlistFriends) {
            console.log("Error: Friend không tồn tại trong  listFriends của User nên không thể pull ra");

        } else if (!isUserExistInlistMeFollows) {
            console.log("Error: Friend không tồn tại trong  listMeFollows của User nên không thể pull ra");
        } else {

            await User.updateOne(
                { _id: friendId },
                {
                    $pull: {
                        listFriends: {
                            userId: userId,
                        },
                        listMeFollows: {
                            userId: userId,
                        },
                        listFollowsMe: {
                            userId: userId,
                        },
                    }
                }
            );


        }
        return res.json({
            message: 'Delete thành công friend của nhau ',
        });
    } catch (error) {
        console.log(error);
    }


}

//! Lấy danh sách bạn bè 
export async function getFriend(req, res) {
    try {
        const userId = req.query.userId;
        const request = req.query.request;


        if (request == "listFriend") {
            const listFriend = (await User.findById(userId).populate({
                path: 'listFriends.userId',
                select: 'avatarUrl fullName',
            })).listFriends;
            return res.json({
                message: 'List Friend',
                listFriend: listFriend
            });
        } else if (request == "listFollowsMe") {
            const listFollowsMe = (await User.findById(userId).populate({
                path: 'listFollowsMe.userId',
                select: 'avatarUrl fullName',
            })).listFollowsMe;
            return res.json({
                message: 'list Follows Me',
                listFollowsMe: listFollowsMe
            });

        } else if (request == "listMeFollows") {
            const listMeFollows = (await User.findById(userId).populate({
                path: 'listMeFollows.userId',
                select: 'avatarUrl fullName',
            })).listMeFollows;
            return res.json({
                message: 'list Me Follows',
                listMeFollows: listMeFollows
            });

        } else if (request == "listSentFriendRequests") {
            const listSentFriendRequests = (await User.findById(userId).populate({
                path: 'listSentFriendRequests.userId',
                select: 'avatarUrl fullName',
            })).listSentFriendRequests;
            return res.json({
                message: 'list Sent Friend Requests',
                listSentFriendRequests: listSentFriendRequests
            });
        } else if (request == "listFriendsSentRequest") {
            const listFriendsSentRequest = (await User.findById(userId).populate({
                path: 'listFriendsSentRequest.userId',
                select: 'avatarUrl fullName',
            })).listFriendsSentRequest;
            return res.json({
                message: 'list Friends SentRequest',
                listFriendsSentRequest: listFriendsSentRequest
            });
        }

    } catch (error) {
        console.log(error);
    }



}

//! Lấy danh sách không phải bạn bè để kết bạn


export async function getStranger(req, res) {
    const userIdToCheck = req.query.userIdToCheck
    try {
      const user = await User.findById(userIdToCheck);
  
      if (!user) {
        return res.json({ message: 'Không tìm thấy người dùng' });
      }
  
      const listFriendsIds = user.listFriends.map((friend) => friend.userId);
    //   const listFollowsMeIds = user.listFollowsMe.map((follower) => follower.userId);
    //   const listMeFollowsIds = user.listMeFollows.map((following) => following.userId);
      const listSentFriendRequestsIds = user.listSentFriendRequests.map((request) => request.userId);
      const listFriendsSentRequestIds = user.listFriendsSentRequest.map((request) => request.userId);
  
      // Tìm tất cả người dùng không nằm trong bất kỳ danh sách nào của người dùng cụ thể
      const usersWithoutInAnyList = await User.find({
        _id: {
          $nin: [
            userIdToCheck,
            ...listFriendsIds,
            // ...listFollowsMeIds,
            // ...listMeFollowsIds,
            ...listSentFriendRequestsIds,
            ...listFriendsSentRequestIds,
          ],
        },
      }, ["_id", "fullName", "avatarUrl"]);
  
     
    return res.json({ stranger: usersWithoutInAnyList });

    } catch (error) {
      console.error(error);
      throw new Error('Đã xảy ra lỗi');
    }
  }

  export async function checkStranger(req, res) {
    const userIdToCheck = req.query.userIdToCheck
    const userId = req.query.userId;
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.json({ message: 'Không tìm thấy người dùng' });
      }
  

      const listFriendsIds = user.listFriends.map((friend) => friend.userId.toString());
    //   const listFollowsMeIds = user.listFollowsMe.map((follower) => follower.userId);
    //   const listMeFollowsIds = user.listMeFollows.map((following) => following.userId);
      const listSentFriendRequestsIds = user.listSentFriendRequests.map((request) => request.userId.toString());
      const listFriendsSentRequestIds = user.listFriendsSentRequest.map((request) => request.userId.toString());
      
      console.log(listFriendsIds);
      console.log(listSentFriendRequestsIds);
      console.log(listFriendsSentRequestIds);
      
      if(listFriendsIds.includes(userIdToCheck)) {
        return res.json({ message: "Friend" });
      } else if(listSentFriendRequestsIds.includes(userIdToCheck)) {

        return res.json({ message: "SentFriendRequest" });

      } else if(listFriendsSentRequestIds.includes(userIdToCheck)) {
        return res.json({ message: "FriendsSentRequest" });

      }
      
      return res.json({ message: "Stranger" });

     
    

    } catch (error) {
      console.error(error);
      throw new Error('Đã xảy ra lỗi');
    }
  }
  
 