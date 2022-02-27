import { useState } from "react"
import {Link, useLocation} from 'react-router-dom';

export default function PlayerJoinScreen() {
    let location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [nickname,setNickName] = useState("");
    let gamepin = queryParams.get('gamepin');

  return (
    <div className="bg-blue-700 min-h-screen flex flex-col justify-center items-center">
    <div className="bg-gray-200 w-80 h-28 rounded mt-10">
        <p className="text-center py-3 font-bold text-xl ">Join the game</p>
        <div className="flex flex-row items-center justify-center">
            <div>
            <input required onChange={(e)=>setNickName(e.target.value)} type="text" className="py-2 px-2 mr-2 border border-gray-400 focus:outline-none rounded" placeholder="Enter nickname.." />
            <Link onClick={e => (!nickname || !gamepin) ? e.preventDefault() : null} to={`/play/game?name=${nickname.trim().toLowerCase()}&pin=${gamepin}`}>
            <button type="submit" className="py-2 px-2 rounded bg-green-700 font-bold text-white">Ok, Go</button>
            </Link>
            </div>
        </div>
    </div>
    </div>
  )
}
