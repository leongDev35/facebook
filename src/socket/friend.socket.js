import { createNotif, createNotifSocket } from "../controller/socketController/notif.socket.controller.js";
import Notif from "../models/notif.model.js";

export async function friendHandleSocket(socket) {
    try {

        socket.on('sendFriendRequest', (idSender,idReceiver) => {
            
            createNotifSocket(idSender,idReceiver,"friend",null,socket.id)


        })

        socket.on('accept', async (notifId, idReceiver, idSender) => {
            createNotifSocket(idSender,idReceiver,"acceptYourRequest",null,socket.id)
            
            await Notif.updateOne({_id: notifId}, {
                $set : {
                    typeNotif: "accept"
                }

            })

        } )
        socket.on('reject', async (notifId) => {
            
            await Notif.updateOne({_id: notifId}, {
                $set : {
                    typeNotif: "reject"
                }

            })

        } )



    } catch (error) {
        console.log(error);
    }
}