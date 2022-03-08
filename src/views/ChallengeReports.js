import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ClipLoader from "react-spinners/ClipLoader";
import authorizedApi from '../api/authorizedApi';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function ChallengeReports() {
    let params = useParams();
    const [isLoading,setisLoading] = useState(true);
    const [assignment,setAssignment] = useState({});
    const [participant,setParticipant] = useState([]);
    const [isCopiyed,setIsCopied] = useState(false);
    participant.sort((a,b)=>(a.points > b.points) ? -1: 1);
    const loadAssignmentReports = async ()=>{
        await authorizedApi.post('/get/assignment/report',{
            id:params.asgnid
        }).then((res)=>{
            setAssignment(res.data);
            setParticipant(res.data.participant);
            setisLoading(false);
        }).catch((err)=>{
          console.log(err);
        })
    }
useEffect(()=>{
    loadAssignmentReports();
},[])
  return <div className='bg-gray-50'>
      <Header />
      <div className='mt-5 text-center'>
      <ClipLoader loading={isLoading} color={"#324"} size={40} />
      </div>

      <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto">

        <div>
            <p className='text-base font-bold text-gray-600'>Report</p>
            <p className='text-2xl font-bold text-gray-600'>{assignment.title}</p>
        </div>
        <div className='flex flex-row bg-white p-4 shadow-md rounded mt-10 items-center'>
            <div className='w-28 h-28 border-8 rounded-full flex justify-center items-center border-blue-600'>
                <div className='flex flex-col justify-center items-center'>
                    <p className='text-2xl font-bold text-gray-600'>{participant.length}</p>
                    <p className='text-sm text-gray-700'>Players</p>
                </div>
            </div>
            <div className='flex flex-col ml-5'>
                <p className='text-xl font-bold text-gray-700'>Invite more players!</p>
                <p className='text-base font-medium text-gray-800'>Invite players by sharing the URL or PIN. Players can join this kahoot up until the deadline.</p>
                <div className='flex flex-row py-1'>
                <input className='py-2 border border-blue-500 px-5 rounded mr-2' type="text" value={`http://championchallenger.demo.saz-zad.com/challenge/${params.asgnid}`} />
                <CopyToClipboard 
                text={`http://championchallenger.demo.saz-zad.com/challenge/${params.asgnid}`}
                onCopy={()=>setIsCopied(true)}
                >
                    <button className='py-2 px-2 bg-blue-500 font-bold text-white rounded'>{isCopiyed?'Copied':'Copy URL'}</button>
                </CopyToClipboard>
                </div>
                {/* <p className='py-2'>Game Pin: {123588}</p> */}
            </div>
        </div>
        <div className='mt-5 bg-white rounded shadow-md p-4'>
            <div className=''>
                <div className='pb-4'><p className='text-lg font-bold text-gray-600'>Players Reports: </p></div>
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-md sm:rounded-lg">
                            <table className="min-w-full">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                    Nickname
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                    Points
                                </th>
                                <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                    Rank
                                </th>
                                </tr>
                            </thead>
                            {participant.map((item,index)=>{
                                return <tbody>
                                <tr className="border-b odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 dark:border-gray-600">
                                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {item.nickname}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                {item.points}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                {index+1}
                                </td>
                                </tr>
                                </tbody>
                            })}
                            </table>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
        </div>
      </div>
  </div>;
}
