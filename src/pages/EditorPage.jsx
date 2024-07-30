import { useEffect, useRef, useState } from "react"
import Clients from "../components/Clients"
import Editor from "../components/Editor"
import initSocket from "../server"
import ACTION from "../assets/Actions"
import "../App.css"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
const EditorPage = () => {
const location = useLocation();
const socketRef = useRef(null);
const codeRef = useRef(null);

const [sideBar, setSideBar] = useState(true)
const [clients, setClients] = useState([])
const {roomId} = useParams()
const navigate = useNavigate();
const handleError=(e)=>{
  toast.error("something went wrong");
  navigate("/")
  
}
useEffect(() => {
 socketRef.current = initSocket();
 const initFunc = () =>{
 socketRef.current.on("code_error",(e)=> handleError(e));
 socketRef.current.on("socket_failed",(e)=>handleError(e));
  socketRef.current.emit(ACTION.JOIN,{
    roomId,
    username : location.state?.username
  }); 
  socketRef.current.on(ACTION.JOINED,({clients,username,socketId})=>{
        if(username !== location.state?.username){
          toast.success(username+" has joined the room")
        }else{
          toast.success("Welcome to the room ! "+username);
        }
        setClients(clients)

        socketRef.current.emit(ACTION.SYNC_CODE,{
          code : codeRef.current,
          socketId
        })
  });

  socketRef.current.on(ACTION.DISCONNECTED,({username, socketId})=>{

    toast.success(username+" has left the room");
    setClients((prev)=>{
    return prev.filter(client=>client.socketId!==socketId)
    })

  });



}

if(!location.state){
  toast.error("You must have username for the room");
  navigate("/")
}else{
  initFunc();
}
  return ()=>{
    socketRef.current.disconnect();
    socketRef.current.off(ACTION.JOIN);
    socketRef.current.off(ACTION.DISCONNECTED);
  }
}, [])

const copyRoomId = async()=>{
  try {
    await navigator.clipboard.writeText(roomId)
    toast.success("Room Id copied to clipboard!")
  } catch (error) {
    toast.error(error.message)
    
  }
}
const leaveRoom = () =>{
  navigate("/")
}
 
  window.addEventListener("resize",()=>{
    if(window.innerWidth>639){
      setSideBar(true)
    }
  })
    
  return (
    <>
     <div className="h-screen max-w-screen flex">
      
     <button className="font-bold font-serif bg-white rounded-full h-5 w-5 absolute top-1 right-1 z-10 drop-shadow-sm hover:drop-shadow-lg p-1 flex items-center justify-center sm:hidden" onClick={()=>setSideBar(!sideBar)}>{sideBar?"X":"+"}</button>
     {sideBar && <div className="aside max-w-48 bg-[#B692C2] border-r-4 border-yellow-200 min-h-screen text-black justify-between flex flex-col p-3">
        <div className="inner relative">
          
          <div className="image border-b-2 border-white relative">
          <img src="/code-mania.png" className="mix-blend-multiply text-white mb-1" alt="code-mania" />
          </div>
          <h3 className="text-lg font-bold mt-3 text-blue-900">Connected</h3>
          <div className="Connected-Clients flex flex-col gap-2 h-full">
            {clients.map(client=>(
              <Clients key={client.socketId} username={client.username}  />
            ))}
          </div>
        </div>
        <div className="outer">
      <div className="aside-top flex flex-col justify-center gap-2">
        <button className=" bg-white rounded font-bold py-1 hover:bg-cyan-400 hover:text-white mx-auto w-full my-auto" onClick={copyRoomId}>Copy Room</button>
        <button className="bg-[#4F1787] py-1 font-bold hover:bg-cyan-700 rounded-md text-white " onClick={leaveRoom}>Leave</button>

      </div>
   
        </div>
      </div>
}
      <div className="editor h-screen w-full sm:w-[calc(100vw-12rem)]">
          <Editor socketRef ={socketRef} roomId={roomId} onCodeChange= {(code)=> codeRef.current = code}/>
      </div>
     </div>
    </>
  )
}

export default EditorPage
