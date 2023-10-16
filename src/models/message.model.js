import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    content: String,
    contentUrlImage: String,
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    isSeen: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});
const Message = model('message', messageSchema);
export default Message;
