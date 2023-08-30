import { Schema, model } from 'mongoose';

const commentSchema = new Schema({

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
    }],
    date: { type: Date, default: Date.now },

    hidden: { type: Boolean, default: false }
});
const Comment = model('comment', commentSchema);

export default Comment;
