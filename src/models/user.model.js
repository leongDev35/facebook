import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    userName: String,
    fullName: String,
    password: String,
    birthday: String,
    phoneNumber: String,
    avatarUrl: {
        type: String,
        default:
            'https://firebasestorage.googleapis.com/v0/b/module5instagram-b1f91.appspot.com/o/BaseFiles%2Fdefaultuser.jpg?alt=media&token=b4932bc6-f626-4605-a2f5-99f0e79bcfda'
    },
    bio: { type: String, default: '' },
    email: String,
    authEmail: { type: Boolean, default: false },
    tokenAuthEmail: { type: String, default: '' },
    postInProfile: [{
        postId: {
            type: Schema.Types.ObjectId,
            ref: "post",
        }
    }],
    postsInPage: [{
        pageId: {
            type: Schema.Types.ObjectId,
            ref: "page",
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "post",
        }

    }],
    postsShareByUser: [{
        postId: {
            type: Schema.Types.ObjectId,
            ref: "post",
        }
    }],
    chatWithFriend: [
        {
            partner: {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
            message: [
                {
                    idMessage: {
                        type: Schema.Types.ObjectId,
                        ref: "message"
                    }
                }
            ],
            lastMessage: {
                type: Schema.Types.ObjectId,
                ref: "message"
            },

        }
    ],
    socketId: String,
    //! Friend
    listFriends: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }],
    listFollowsMe: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }],
    listMeFollows: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }],
    listSentFriendRequests: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }],
    listFriendsSentRequest: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }],
//! Notif
notifInUser: [{
    notifId: {
        type: Schema.Types.ObjectId,
        ref: "notif"
    }
}]


});
const User = model('user', userSchema);

export default User;
