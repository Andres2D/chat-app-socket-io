const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");

const socketController = async(socket = new Socket()) => {
    try {
        const user = await checkJWT(socket.handshake.headers['x-token']);
        if(!user) {
            return socket.disconnect();
        }    
        console.log(`${user.name} is connected`);
    }catch(err) {
        return socket.disconnect();
    }
}

module.exports = {
    socketController
}
