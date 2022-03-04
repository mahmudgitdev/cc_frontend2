import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import socket from "../socket/socket";
import ClipLoader from "react-spinners/ClipLoader";
export default function JoinScreen() {
    const navigate = useNavigate();
    const [gamepin,setGamepin] = useState("");
    const [isError,setIsError] = useState(false);
    const [isSuccess,setIsSuccess] = useState(false);
    const [isLoading,setisLoading] = useState(false);
    const [error,setError] = useState("");
    const [joinError,setJoinError] = useState(false);


    const checkGamePin = (e)=>{
        e.preventDefault();
        setIsError(false);
        setisLoading(true);
        socket.emit('checkJoin',gamepin,(response)=>{
            if(response === "success"){
                setTimeout(()=>{
                    e.target.gamepin.value = "";
                    setisLoading(false);
                    setIsSuccess(true);
                },1000)
               
            }else{
                setTimeout(()=>{
                    setisLoading(false);
                    setIsError(true);
                },1000)
            }
        });
    }

    const joinGame = (e)=>{
        e.preventDefault();
        setisLoading(true);
        const name = e.target.nickname.value;
        socket.emit('join',{name,gamepin},(response)=>{
            if(response.error){
                setTimeout(()=>{
                    setError(response.error);
                    setJoinError(true);
                    setisLoading(false);
                },1000)

            }else{
                setTimeout(()=>{
                    navigate('/play/game',{state: response.player});
                },1000)
            }
        });
    }

    const handleFocus = ()=>{
        setIsError(false);
        setJoinError(false);
    }
  return (
    <div className="bg-blue-700 min-h-screen flex flex-col gap-3 justify-center items-center">
    <div>
        <p className="text-white font-bold text-xl">Champion Challenger</p>
    </div>
    <div className="bg-gray-200 w-80 rounded flex justify-center items-center py-4">
        <div className="flex flex-col gap-2 items-center justify-center">
            {!isSuccess?(<>
                {isError?(<>
                        <p className="text-center text-red-600 font-bold text-sm">Invalid!! Game PIN</p>
                </>):(<></>)}
                <form className="flex flex-col justify-center items-center gap-2" onSubmit={checkGamePin}>
                <input onFocus={handleFocus} name="gamepin" onChange={(e)=>setGamepin(e.target.value)} required type="number" className={isError?'w-full py-2 px-2 border border-red-600 focus:outline-none rounded text-center font-bold appearance-none':'w-full py-2 px-2 border border-gray-400 focus:outline-none rounded text-center font-bold appearance-none'} placeholder="Game PIN" />
                <div className="w-full relative">
                    <button type="submit" className="w-full py-2 rounded bg-green-700 font-bold text-white">JOIN</button>
                    <div className="absolute top-1.5 right-2"><ClipLoader loading={isLoading} color={"#ffff"} size={28} /></div>
                </div>
                
            </form>
            </>):(<>
                {joinError?(<>
                        <p className="text-center text-red-600 font-bold text-sm">{error}</p>
                </>):(<></>)}
                <form className="flex flex-col justify-center items-center gap-2" onSubmit={joinGame}>
                    <input onFocus={handleFocus} required name="nickname" type="text" className="w-full py-2 px-2 border border-gray-400 focus:outline-none rounded text-center font-bold appearance-none" placeholder="Enter Nickname.." />
                    <div className="w-full relative">
                    <button type="submit" className="w-full py-2 rounded bg-green-700 font-bold text-white">Let's Go</button>
                    <div className="absolute top-1.5 right-2"><ClipLoader loading={isLoading} color={"#ffff"} size={28} /></div>
                    </div>
                </form>
            </>)}
            
        </div>
    </div>
    </div>
  )
}
