import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    content: String,
    contentImage: String,
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
        idComment: {
            type: Schema.Types.ObjectId,
            ref: "comment",
        }
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
