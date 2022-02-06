import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import swal from 'sweetalert';
import authorizedApi from "../api/authorizedApi";
import {GridLoader,PropagateLoader} from 'react-spinners';
import Countdown from "react-countdown";
export default function ChallengeScreen() {
    let params = useParams();
    const [quiz,setQuiz] = useState({});
    const [questions,setQuestions] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [loadingStart,setloadingStart] = useState(false);
    const [nickname,setNickName] = useState("");
    const [isStart,setIsStart] = useState(false);
    const [isShowName,setIsShowName] = useState(false);
    const [isShowTitle,setisShowTitle] = useState(false);
    const [currentQuestion,setCurrentQuestion] = useState(0);
    const [points,setPoints] = useState(0);
    const [isAnswered,setisAnswered] = useState(false);
    const [isShowResult,setisShowResult] = useState(false);
    const [isAnimation,setisAnimation] = useState(false);
const loadChallenge = async()=>{
    await authorizedApi.post('/get/challenge',{
        id: params.qid
    }).then((res)=>{
        console.log(res.data)
        setQuiz(res.data);
        setQuestions(res.data.questions);
        setTimeout(()=>{
            setIsLoading(false);
        },3000)
    })
}
const letstart = (e)=>{
    e.preventDefault();
    setIsShowName(true);

    setTimeout(()=>{
        setIsShowName(false);
        setisShowTitle(true);
        setloadingStart(true);
        setIsStart(true);
    },2000);
    setTimeout(()=>{
        setloadingStart(false);
        setisShowTitle(false);
    },4000)


}
const submitAnswer = (answer)=>{
    setisAnswered(true);
    if(answer === questions[currentQuestion].answer){
        setPoints(points+1);
        swal({
            title: "Your Answer is Correct!",
            icon: "success",
            button: "Aww yiss!",
          });
    }else{
        swal({
            title: "Opps! incorrect Answer",
            icon: "warning",
            button: "ok",
          });
    }
}
const handleNext = ()=>{
    
    const nextQuestion = currentQuestion + 1;
       if(nextQuestion < questions.length){
            setisAnimation(true);
            setTimeout(()=>{
                setCurrentQuestion(nextQuestion);
                setisAnswered(false);
                setisAnimation(false);
            },2000)
        }else{
            setisShowResult(true);
    }


    
}
const renderer = ({seconds, completed }) => {
    if (completed) {
      setisAnswered(true);
      swal({
        title: "Times Up",
        icon: "warning",
        button: "Next",
      });
      return "";
    } else {
      // Render a countdown
      return <span>{seconds}</span>;
    }
  };
useEffect(()=>{
    loadChallenge();
},[]);

  return (
      <div>

        {isShowResult?(
            <>
            <div className="bg-blue-700 min-h-screen flex flex-col justify-center items-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }} 
                >
                  <p className="text-xl text-white font-bold ">Hi! "{nickname}" your Score is: {points}</p>
                  <p className="text-sm font-bold text-white mt-2">Out of {questions.length} Questions</p>
                </motion.div> 
            </div>
            </>
        ):(
            <>
            {isLoading?(
            <div className="bg-blue-700 min-h-screen flex flex-col justify-center items-center">
                <div className="flex justify-center w-full h-full items-center">
                <GridLoader loading={isLoading} color={"#fff"} size={20} margin={2} />
                </div>
            </div>
        ):(
            <>
                    {isShowName?(
                        <div className="bg-blue-700 min-h-screen flex flex-col justify-center items-center">
                        <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20
                        }} 
                        className="bg-white px-2 py-2 rounded font-bold">
                            <p>{nickname}</p>
                        </motion.div>
                        </div>
                    ):(<></>)}


                {isShowTitle?(
                        <div className="bg-blue-700 min-h-screen flex flex-col justify-center items-center">
                        <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20
                        }} 
                        className="bg-white px-4 py-3 rounded font-bold">
                            <p>{quiz.title}</p>
                        </motion.div>
                        <div className="mt-10">
                        <PropagateLoader loading={loadingStart} color={"#fff"} size={20} margin={2} />
                        </div>
                        </div>
                    ):(<></>)}

                {isStart?(
                    <>
                        {loadingStart?(
                            <></>
                        ):(
                            <>
                            {isAnimation?(
                                <>
                                    <div className="bg-blue-700 min-h-screen flex flex-col justify-center items-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20
                                            }} 
                                        >
                                        <p className="text-xl text-white font-bold ">Loading next</p>
                                        </motion.div> 
                                    </div>
                                </>
                            ):(
                                <>
                                <div className="flex w-full py-6 justify-center shadow-md bg-white items-center">
                                    <p className="font-bold text-2xl text-gray-600">{questions[currentQuestion].question}</p>
                                </div>
                            <div className="flex flex-row items-center justify-between max-w-sm mx-auto md:max-w-3xl lg:max-w-5xl">
                            <div className="w-28 h-28 bg-blue-500 text-white text-3xl font-bold flex justify-center items-center rounded-full">
                            <Countdown 
                            date={Date.now() + 20000}
                            renderer={renderer}
                            />
                            </div>
                            <div className="w-80 mx-auto mt-5 overflow-hidden">
                                <img className="w-full" src={questions[currentQuestion].image} alt="q_image" />
                            </div>
                            <div>
                                <button onClick={handleNext} className="px-4 py-2 bg-green-700 rounded font-bold text-white text-base">Next</button>
                            </div>
                            </div>
                        <div className="max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto mt-10">
                        {isAnswered?(
                        <div className='grid grid-cols-2 gap-4 mt-5'>
                            <div className={questions[currentQuestion].answer === "a" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{questions[currentQuestion].option1}</div>
                            
                            <div className={questions[currentQuestion].answer === "b" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{questions[currentQuestion].option2}</div>
                            <div className={questions[currentQuestion].answer === "c" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{questions[currentQuestion].option3}</div>
                            <div className={questions[currentQuestion].answer === "d" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{questions[currentQuestion].option4}</div>
                         </div>
                        ):(
                            <div className='grid grid-cols-2 gap-4 mt-5'>
                           <motion.div
                           whileHover={{ scale: 1.02 }}
                           onClick={()=>submitAnswer("a")}
                           >
                               <button className="bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option1}</button>
                           </motion.div>
                           <motion.div 
                           whileHover={{ scale: 1.02 }}
                           onClick={()=>submitAnswer("b")}>
                               <button className="bg-blue-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option2}</button>
                           </motion.div>
                           <motion.div 
                           whileHover={{ scale: 1.02 }}
                           onClick={()=>submitAnswer("c")}>
                               <button className="bg-yellow-500 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option3}</button>
                           </motion.div>
                           <motion.div 
                           whileHover={{ scale: 1.02 }}
                           onClick={()=>submitAnswer("d")}>
                               <button className="bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option4}</button>
                           </motion.div>
                        </div>
                        )}
                        

                        </div>
                                </>
                            )}
                                

                            </>
                        )}
                    </>
                ):(
                    <div className="bg-blue-700 min-h-screen flex flex-col justify-center items-center">
                    <div className="bg-gray-200 w-80 h-28 rounded mt-10">
                        <p className="text-center py-3 font-bold text-xl ">Join the game</p>
                        <div className="flex flex-row items-center justify-center">
                            <form onSubmit={letstart}>
                            <input required onChange={(e)=>setNickName(e.target.value)} type="text" className="py-2 px-2 mr-2 border border-gray-400 focus:outline-none rounded" placeholder="Enter nickname.." />
                            <button type="submit" className="py-2 px-2 rounded bg-green-700 font-bold text-white">Let's Go</button>
                            </form>
                        </div>
                    </div>
                    </div>
                )}


            </>
        )}
            
            </>
        )}


        

      </div>
  )
}
