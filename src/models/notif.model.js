import { Schema, model } from 'mongoose';

const notifSchema = new Schema({
    actionUser: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    receiverUser: {
        type: Schema.Types.ObjectId,
        ref: "page",
    },
    typeNotif: { type: String, default: "" },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "post",
    },
    isSeen: { type: Boolean, default: false},
    date: { type: Date, default: Date.now }

});
const Notif = model('notif', notifSchema);
export default Notif;
