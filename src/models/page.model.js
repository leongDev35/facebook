import { Schema, model } from 'mongoose';

const pageSchema = new Schema({
    name: String,
    ownerPage: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    postInPage: [{
        postId: {
            type: Schema.Types.ObjectId,
            ref: "post",
        }
    }],
    member: [{
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    }]
});
const Page = model('page', pageSchema);
export default Page;
