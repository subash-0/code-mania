import {useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuId } from "uuid";
import toast from "react-hot-toast";
import {useNavigate}  from "react-router-dom"
const Home = () => {
  const navigate = useNavigate()
  const [ids, setIds] = useState({
    userId: "",
    RoomId: "",
  });
  const generateRoomId = () => {
    const uId = uuId();

    setIds({
      ...ids,
      RoomId: uId,
    });

    toast.success("A New Room Created !");
  };
  const joInRoom = () => {
    if (!ids.RoomId || !ids.userId) {
      toast.error("Room Id & Username is required !");
      return;
    }
    navigate(`/editor/${ids.RoomId}`,{
      state:{
        username:ids.userId
      }
    })
  };

 
  const handleKeyUp = (e) =>{
    if(e.code === "Enter"){
      joInRoom();
    }
  }
  return (
    <>
      <div className="max-h-screen max-w-screen h-screen p-2 w-screen bg-[#30004a] text-white flex items-center justify-center flex-col">
        <div className="bg-white   px-8 py-4 rounded-sm max-w-96">
          <img
            src="/code-mania.png"
            alt="code mania logo"
            className="mix-blend-multiply mb-4"
          />
          <h4 className="text-black my-5 mt-5">Paste Invitation Room ID:</h4>
          <div className="flex flex-col gap-2 text-black my-5">
            <input
              type="text"
              className="outline-none focus  px-1 placeholder:uppercase placeholder:text-black/55 border-b-2 border-cyan-400 "
              placeholder="Room Id"
              value={ids.RoomId}
              onChange={(e) => setIds({ ...ids, RoomId: e.target.value })}

              onKeyUp={handleKeyUp}
              
            />
            <input
              type="text"
              className="outline-none  px-1 placeholder:uppercase placeholder:text-black/55 border-b-2 border-cyan-400 "
              placeholder="github username e.g. subash-0"
              value={ids.userId}
              onChange={(e) => setIds({ ...ids, userId: e.target.value })}

              onKeyUp={handleKeyUp}

            />
            <button className="bg-[#4F1787]  text-white py-2 rounded-md hover:bg-cyan-600 mt-3" onClick={joInRoom}>
              JOIN
            </button>
            <span className="mt-3">
              do not have an invite: create &nbsp;
              <button
                onClick={generateRoomId}
                className="text-orange-500 hover:underline my-5"
              >
                New Room
              </button>
            </span>
          </div>
        </div>
        <h4 className="fixed bottom-2">
          Made With Web socket by{" "}
          <Link
            to={"https://github.com/subash-0"}
            target="_blank"
            className="text-orange-400"
          >
            Subash-0
          </Link>
        </h4>
      </div>
    </>
  );
};

export default Home;
