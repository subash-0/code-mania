import io from 'socket.io-client';

const initSocket = () => {
    let socket = io("http://localhost:5000", {  // Ensure the port number matches your server's port
        transports: ['websocket'],
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
    });



    return socket;
};

export default initSocket;



