const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const {ChatMessages} = require('../models');

const chatMessages = new ChatMessages();

const socketController = async(socket = new Socket(), io) => {
    try {
        const user = await checkJWT(socket.handshake.headers['x-token']);
        
        if(!user) {
            return socket.disconnect();
        }

        // Add user connected
        chatMessages.connectUser(user);
        io.emit('active-users', chatMessages.usersArr);
        socket.emit('receive-messages', chatMessages.lastMessages);

        // Clean when someone is disconnected
        socket.on('disconnect', () => {
            chatMessages.disconnectUser(user.id);
            io.emit('active-users', chatMessages.usersArr);
        });

        //Connect to special room
        socket.join(user.id); // 

        socket.on('send-message', ({uid, message}) => {

            if(uid) {
                //private message
                socket.to(uid).emit('private-message', { from: user.name, message })
            } else{
                chatMessages.sendMessage(user.id, user.name, message);
                io.emit('receive-messages', chatMessages.lastMessages);
            }
        });

    }catch(err) {
        return socket.disconnect();
    }
}

module.exports = {
    socketController
}
