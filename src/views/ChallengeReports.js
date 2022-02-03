import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ClipLoader from "react-spinners/ClipLoader";
import authorizedApi from '../api/authorizedApi';
import {CopyToClipboard} from 'react-copy-to-clipboard';
export default function ChallengeReports() {
    let params = useParams();
    const [isLoading,setisLoading] = useState(true);
    const [quiz,setQuiz] = useState({});

    const loadQuiz = async ()=>{
        await authorizedApi.post('/get/quiz',{
            id:params.qid
        }).then((res)=>{
          setQuiz(res.data)
          setisLoading(false);
        }).catch((err)=>{
          console.log(err);
        })
    }
useEffect(()=>{
    loadQuiz();
},[])
  return <div>
      <Header />
      <div className='mt-5 text-center'>
      <ClipLoader loading={isLoading} color={"#324"} size={40} />
      </div>

      <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto">

        <div>
            <p className='text-base'>Report</p>
            <p className='text-xl font-bold'>{quiz.title}</p>
        </div>
        <div className='flex flex-row mt-5 items-center'>
            <div className='w-28 h-28 border-8 rounded-full flex justify-center items-center border-blue-400'>
                0
            </div>
            <div className='flex flex-col ml-5'>
                <p className='text-xl font-bold text-gray-700'>Invite more players!</p>
                <p className='text-base font-medium text-gray-800'>Invite players by sharing the URL or PIN. Players can join this kahoot up until the deadline.</p>
                <div className='flex flex-row py-1'>
                <input className='py-2 border border-blue-500 px-5 rounded mr-2' type="text" value={`http:localhost/challenge/${params.asgnid}`} />
                <CopyToClipboard text={`http://localhost:3000/challenge/${params.asgnid}`}>
                    <button className='py-2 px-2 bg-blue-500 font-bold text-white rounded'>Copy URL</button>
                </CopyToClipboard>
                </div>
                {/* <p className='py-2'>Game Pin: {123588}</p> */}
            </div>
            
        </div>
      </div>
  </div>;
}
