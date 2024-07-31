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
const [lang, setLang] = useState("Cpp");
const [sideBar, setSideBar] = useState(true)
const [clients, setClients] = useState([])
const {roomId} = useParams()
const navigate = useNavigate();

let username = location.state?.username;
const handleError=()=>{
  toast.error("something went wrong");
  navigate("/")
  
}
useEffect(() => {
 const initFunc =  () =>{
  
 socketRef.current =  initSocket();
 socketRef.current.on("code_error",(e)=> handleError(e));
 socketRef.current.on("socket_failed",(e)=>handleError(e));
  socketRef.current.emit(ACTION.JOIN,{
    roomId,
    username 
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
  socketRef.current.on("copy",({username})=>{
    toast.success(`${username} copied the code`)
  })
  socketRef.current.on(ACTION.DISCONNECTED,({username, socketId})=>{

    toast.success(username+" has left the room");
    setClients((prev)=>{
    return prev.filter(client=>client.socketId!==socketId)
    })

  });
  socketRef.current.on("paste",({username})=>{
    toast.success(`${username} paste the code !`)
  })

  socketRef.current.on("cut",({username})=>{
    toast.success(`${username} cut the code !`)
  })

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
    socketRef.current.off("copy");
    socketRef.current.off("copied");
    
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
      
     <button className="font-bold font-serif bg-white rounded-full h-8 w-8 absolute top-2 right-2 z-10 drop-shadow-sm hover:drop-shadow-lg p-1 flex items-center justify-center sm:hidden" onClick={()=>setSideBar(!sideBar)}>{sideBar?"X":"+"}</button>
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
        <button className=" bg-white rounded font-bold py-1 hover:bg-cyan-400 hover:text-white mx-auto w-full my-auto z-10" onClick={copyRoomId}>Copy Room</button>
        <button className="bg-[#4F1787] py-1 font-bold hover:bg-cyan-700 rounded-md text-white z-10 " onClick={leaveRoom}>Leave</button>

      </div>
   
        </div>
      </div>
}
      <div className="editor h-screen w-full sm:w-[calc(100vw-12rem)] relative">
        <div className="absolute mt-36 sm:mt-0 top-0 sm:top-[10%] right-3  z-10  w-0 text-black p-4  flex items-center flex-col justify-evenly">
          <select name="" id="" className="bg-black/5 text-orange-500 hover:bg-slate-700 p-2 rounded-md outline-none cursor-pointer px-5 rotate-90 mb-24" onChange={(e)=>setLang(e.target.value)}>
              <option value="" disabled selected>{lang}</option>
              <option value="cpp">C++</option>
              <option value="Java">JAVA</option>
              <option value="Python">PYTHON</option> 
          </select>
          <button className="bg-black/5 rounded-md px-5 py-2 text-orange-500 hover:bg-slate-700 rotate-90">RUN</button>
        </div>
        <div className="edit">
          <Editor socketRef ={socketRef} roomId={roomId} lang={lang} onCodeChange= {(code)=> codeRef.current = code} username={username}/>
        </div>
      </div>
     </div>
    </>
  )
}

export default EditorPage
