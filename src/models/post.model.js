import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    content: String,
    ownerPost: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    pageId: {
        type: Schema.Types.ObjectId,
        ref: "page",
    },
    like: [{
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }],
    comment: [{
        contentComment: String,
        idUserComment: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        likeComment: [{
            idUser: {
                type: Schema.Types.ObjectId,
                ref: "user",
            }
        }],
        reply: [{
            contentReply: String,
            idUserReply: {
                type: Schema.Types.ObjectId,
                ref: "user",
            },
            likeReply: [{
                idUser: {
                    type: Schema.Types.ObjectId,
                    ref: "user",
                }
            }]
        }]
    }],
    share: [{
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }],

    date: { type: Date, default: Date.now },
    
    hidden: { type: Boolean, default: false },

    status: { type: String, default: "public" }
});
const Post = model('post', postSchema);
export default Post;
