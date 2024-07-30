import io from 'socket.io-client';

const initSocket = () => {
    return io(process.env.REACT_APP_SERVER_URL, {
        transports: ['websocket'],
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
    });
};


export default initSocket;
