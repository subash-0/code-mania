import express from "express"
import http from 'http';
import {Server} from'socket.io';
import cors from 'cors';
import ACTIONS from "./src/assets/Actions.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
   
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
app.use(cors());
app.use(express.static('./dist'));
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,"dist","index.html"));
})
 
let userMapping = {};
const getAllclientsInRoom = (roomId) =>{

    return  (Array.from(io.sockets.adapter.rooms.get(roomId)) || []).map((socketId)=>{
        return {
            socketId,
            username: userMapping[socketId]
        };
    })

}



io.on('connection', (socket) => {

   socket.on(ACTIONS.JOIN,({roomId,username})=>{
    userMapping[socket.id]=username;
    socket.join(roomId)
    let clients = getAllclientsInRoom(roomId);
    clients.forEach(({socketId})=>{
        io.to(socketId).emit(ACTIONS.JOINED,{
            clients,
            username,
            socketId:socket.id
        })
    })

   });

   socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{ code});
   });


   socket.on("copy",({roomId,username})=>{
    console.log(roomId)
    socket.in(roomId).emit("copy",{
        username
    })
   });
      socket.on("paste",({roomId,username})=>{
    console.log(roomId)
    socket.in(roomId).emit("paste",{
        username
    })
   }); 
 socket.on("cut",({roomId,username})=>{
    console.log(roomId)
    socket.in(roomId).emit("cut",{
        username
    })
   });
   



   socket.on(ACTIONS.SYNC_CODE,({code,socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code})
   })

   socket.on("disconnecting",()=>{
    const rooms = [...socket.rooms];
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId : socket.id,
            username : userMapping[socket.id]
        })
    })
    delete userMapping[socket.id]
    socket.leave();
   })
});







server.listen(PORT, () => {
    console.log('Listening on port 5000');
   
});
