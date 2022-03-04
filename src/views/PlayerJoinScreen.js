import { useEffect, useState } from "react"
import {useNavigate, useLocation} from 'react-router-dom';
import socket from "../socket/socket";
import {GridLoader,ClipLoader} from 'react-spinners';
export default function PlayerJoinScreen() {
    let location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [isChecking,setIsChecking] = useState(true);
    const [isLoading,setisLoading] = useState(false);
    const [error,setError] = useState("");
    const [joinError,setJoinError] = useState(false);

    let gamepin = queryParams.get('pin');

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

  }

  useEffect(()=>{
    socket.emit('checkJoin',gamepin,(response)=>{
      if(response === "success"){
          setTimeout(()=>{
            setIsChecking(false);
          },1000)
         
      }else{
        navigate('/join',{replace: true});
      }
  });
  },[])


  return (
    <div className="bg-blue-700 min-h-screen flex flex-col gap-3 justify-center items-center">
    {isChecking?(<>
      <GridLoader loading={isChecking} color={"#fff"} size={20} margin={2} />
    </>):(<>
    <div className="bg-gray-200 w-80 rounded flex justify-center items-center py-4">
      <div className="flex flex-col gap-2 items-center justify-center">
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
        </div>
       </div>
      </>)}
  </div>
  )
}
