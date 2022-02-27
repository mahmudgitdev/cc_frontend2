import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import swal from 'sweetalert';
import authorizedApi from "../api/authorizedApi";
import {GridLoader,PropagateLoader} from 'react-spinners';
import CountUp from 'react-countup';
import correct_audio from '../audio/correct.mp3';
import wrong_audio from '../audio/wrong.mp3';
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
    const [isShowTimer,setisShowTimer] = useState(true);
    const [currentQuestion,setCurrentQuestion] = useState(0);
    const [points,setPoints] = useState(0);
    const [isAnswered,setisAnswered] = useState(false);
    const [isAnsweredOpenEnded,setisAnsweredOpenEnded] = useState(false);
    const [isShowResult,setisShowResult] = useState(false);
    const [isAnimation,setisAnimation] = useState(false);
    const [round1Questions,setRound1Questions] = useState([]);
    const [round2Questions,setRound2Questions] = useState([]);
    const [round3Questions,setRound3Questions] = useState([]);
    const [isRound2Done,setisRound2Done] = useState(false);
    const [isRound3Done,setisRound3Done] = useState(false);
    const [isRoundStart,setisRoundStart] = useState(false);
    const [isShowCurrectAnswerMessage,setisShowCurrectAnswerMessage] = useState(false);
    const [isShowWrongAnswerMessage,setisShowWrongAnswerMessage] = useState(false);
    const [firstRightAnsweredNotYet,setfirstRightAnsweredNotYet] = useState(true);
    const [recentPointsAdd,setRecentPointsAdd] = useState(0);
    const [scoreboard,setScoreBoard] = useState([]);

   
    



const loadChallenge = async()=>{
    await authorizedApi.post('/get/challenge',{
        id: params.asgnid
    }).then((res)=>{
        setQuiz(res.data);
        setRound1Questions([...round1Questions,...res.data.questions.filter((item)=> item.round === "1")]);
        setRound2Questions([...round2Questions,...res.data.questions.filter((item)=> item.round === "2")]);
        setRound3Questions([...round3Questions,...res.data.questions.filter((item)=> item.round === "3")]);
        setTimeout(()=>{
            setIsLoading(false);
        },2000)

    });
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
        startGameRound1();
        setloadingStart(false);
        setisShowTitle(false); 
    },4000);
}
const saveReports = async()=>{
    await authorizedApi.post('/api/actions/save/reports',{
        assignmentId: params.asgnid,
        nickname: nickname,
        points: points
    }).then((res)=>{
        getReports();
    }).catch(err=>{
        alert("Connection Error!!");
    })
}

const getReports = async()=>{
    await authorizedApi.post('/get/assignment/report',{
        id:params.asgnid
    }).then((res)=>{
        setScoreBoard(res.data.participant);
    }).catch((err)=>{
      console.log(err);
    })
}
const submitOpenendedAnswer =(event)=>{
    event.preventDefault();
    setisShowTimer(false);
    setisAnsweredOpenEnded(true);
    var answer = event.target.open_ended_answer.value;
    var exits_answer = questions[currentQuestion].open_ended_option.includes(answer);
    if(exits_answer){
        if(firstRightAnsweredNotYet){
            setPoints(points + parseInt(questions[currentQuestion].points_frans?questions[currentQuestion].points_frans:"0"));
            setfirstRightAnsweredNotYet(false);
            setRecentPointsAdd(questions[currentQuestion].points_frans?questions[currentQuestion].points_frans:"0");
        }else{
            setPoints(points + parseInt(questions[currentQuestion].points_remaining?questions[currentQuestion].points_remaining:"0"));
            setRecentPointsAdd(questions[currentQuestion].points_remaining?questions[currentQuestion].points_remaining:"0");
        }
        setTimeout(()=>{
            setisShowCurrectAnswerMessage(true);
        },400);
    }else{
        setTimeout(()=>{
            setisShowWrongAnswerMessage(true);
        },400);
    }

}
const submitAnswer = (answer)=>{
    setisAnswered(true);
    setisShowTimer(false);
    if(answer === questions[currentQuestion].answer){
        if(firstRightAnsweredNotYet){
            setPoints(points + parseInt(questions[currentQuestion].points_frans?questions[currentQuestion].points_frans:"0"));
            setfirstRightAnsweredNotYet(false);
            setRecentPointsAdd(questions[currentQuestion].points_frans);
        }else{
            setPoints(points + parseInt(questions[currentQuestion].points_remaining?questions[currentQuestion].points_remaining:"0"));
            setRecentPointsAdd(questions[currentQuestion].points_remaining);
        }
        setTimeout(()=>{
            setisShowCurrectAnswerMessage(true);
        },400);
    }else{
        setTimeout(()=>{
            setisShowWrongAnswerMessage(true);
        },400); 
    }
}

const startGameRound1 = ()=>{
    setisRoundStart(true);
    setQuestions([...questions,...round1Questions]);
    setTimeout(()=>{
        setisRoundStart(false);
    },4000);
}
const startGameRound2 = ()=>{
    setisRoundStart(true);
    setQuestions([...questions,...round2Questions]);
    setCurrentQuestion(round1Questions.length);
    setisRound2Done(true);
    setisAnswered(false);
    setTimeout(()=>{
        setisRoundStart(false);
    },4000);
}
const startGameRound3 = ()=>{
    setisRoundStart(true);
    setQuestions([...questions,...round3Questions]);
    setCurrentQuestion(round1Questions.length+round2Questions.length);
    setisRound3Done(true);
    setisAnswered(false);
    setTimeout(()=>{
        setisRoundStart(false);
    },4000);
}
const handleNext = ()=>{
    setisShowTimer(true);
    setisShowCurrectAnswerMessage(false);
    setisShowWrongAnswerMessage(false);
    const nextQuestion = currentQuestion + 1;
       if(nextQuestion < questions.length){
            setisAnimation(true);
            setTimeout(()=>{
                setCurrentQuestion(nextQuestion);
                setisAnswered(false);
                setisAnsweredOpenEnded(false);
                setisAnimation(false);
            },2000)
        }else{
            if(!isRound2Done){
                startGameRound2();
            }else if(!isRound3Done){
                startGameRound3();
            }else{
                setisShowResult(true);
                saveReports();
            }
             
        }
}

  const TimesUp = ()=>{
    if(questions[currentQuestion].question_type === "quiz"){
        setisAnswered(true);
      }else{
        setisAnsweredOpenEnded(true);
      }
      swal({
        title: "Times Up",
        icon: "warning",
        button: "Next",
      });
  }
useEffect(()=>{
    loadChallenge();
},[]);

  return (
      <div>

        {isShowResult?(
            <>
            <div className="bg-blue-700 min-h-screen flex flex-col items-center overflow-hidden">
            <div className="flex w-full py-3 justify-center shadow-md bg-white items-center">
                <p className="font-bold text-4xl text-gray-700">Scoreboard</p>
            </div>
            <div className="w-full">
            <div className="max-w-sm md:max-w-2xl lg:max-w-5xl p-4 rounded shadow-inner bg-blue-900 mx-auto mt-10 md:px-28">
            {scoreboard.sort((a,b)=> (a.points> b.points)?-1:1).map((item,i)=>{
                return <div className={item.nickname === nickname ? "py-2 bg-white rounded mt-3": "py-2 mt-3"}>
                  <div className="flex flex-row justify-between items-center gap-4 px-10">
                      <div className="flex flex-row items-center gap-4">
                      <p className={item.nickname === nickname ?"text-gray-700 font-bold text-xl":"text-white font-bold text-xl"}>{i+1}</p>
                      <p className={item.nickname === nickname ?"text-gray-700 font-bold text-xl":"text-white font-bold text-xl"}>{item.nickname}</p>
                      </div>
                      <p className={item.nickname === nickname ?"text-gray-700 font-bold text-xl":"text-white font-bold text-xl"}>{item.points}</p>
                  </div>
                </div>
            })}
            </div>
            </div>
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
                        <div className="w-full bg-blue-700 min-h-screen flex flex-col justify-center items-center overflow-hidden">
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
                            <>
                            </>
                        ):(
                            <>
                            {isAnimation?(
                                <>
                                    <div className="w-full bg-blue-700 min-h-screen flex flex-col justify-center items-center overflow-x-hidden">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20
                                            }}
                                            className="w-full mx-auto bg-white p-4 text-center"
                                        >
                                        <p className="text-xl font-bold ">Loading next</p>
                                        
                                        </motion.div>
                                            
                                    </div>
                                </>
                            ):(
                            <>
                            {isRoundStart?(
                        <>
                            <div className="w-full bg-blue-700 min-h-screen flex flex-col justify-center items-center overflow-hidden">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20
                                            }}
                                            className="w-full mx-auto bg-white p-4 text-center"
                                        >
                                        <motion.p 
                                        initial={{ scale: 0 }}
                                        animate={{ rotate: 360, scale: 1 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 260,
                                          damping: 50
                                        }}
                                        className="text-2xl font-bold text-orange-600">Round {questions[currentQuestion].round}
                                        </motion.p>
                                        
                                        </motion.div>
                                            
                              </div>
                           </>
                         ):(<>
                         
                         <div className="flex w-full py-6 justify-center shadow-md bg-white items-center">
                            <p className="font-bold text-2xl text-gray-600">{questions[currentQuestion].question}</p>
                        </div>
                        {isShowCurrectAnswerMessage?(
                        <>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 25
                                }}
                        className="w-full bg-green-500 h-20 flex items-center justify-center">
                            <div className="w-36 bg-green-700 py-2 rounded flex flex-col items-center justify-center shadow-inner">
                                <p className="text-white font-bold">Correct Answer</p>
                                <p className="text-white font-bold text-xs">+ {recentPointsAdd}</p>
                            </div>
                            <audio autoPlay={true}>
                                <source src={correct_audio} type="audio/ogg" />
                                <source src={correct_audio} type="audio/mpeg" />
                            </audio>
                        </motion.div>
                        </>
                        ):(<></>)}
                        {isShowWrongAnswerMessage?(
                        <>
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 25
                            }}
                        className="w-full bg-red-500 h-20 flex items-center justify-center">
                            <div className="w-36 bg-red-700 py-2 rounded flex flex-col items-center justify-center shadow-inner">
                                <p className="text-white font-bold">Wrong Answer</p>
                                <p className="text-white font-bold text-xs">it's not over just yet!</p>
                            </div>
                            <audio autoPlay={true}>
                                <source src={wrong_audio} type="audio/ogg" />
                                <source src={wrong_audio} type="audio/mpeg" />
                            </audio>
                        </motion.div>
                        </>
                        ):(<></>)}
                        <div className="flex flex-row items-center justify-between max-w-sm mx-auto md:max-w-3xl lg:max-w-5xl">
                            <div className={isShowTimer?"w-20 h-20 bg-green-600 text-white text-3xl font-bold flex justify-center items-center rounded-full":"bg-white w-20 h-20"}>
                            {isShowTimer?(
                                <>
                                <CountUp 
                                    start={questions[currentQuestion].time_limit}
                                    end={0}
                                    duration={questions[currentQuestion].time_limit}
                                    onEnd={()=>TimesUp()}
                                />
                                </>
                            ):(
                                <></>
                            )}
                            </div>

                            <div className='flex justify-center items-center overflow-hidden text-center mx-auto rounded w-72 h-48 bg-white shadow-lg mt-5'>
                   
                                {questions[currentQuestion].image?(
                                        <div>
                                            <img src={questions[currentQuestion].image?questions[currentQuestion].image:""} style={{width:"100%",height:"100%"}} alt="qimage" />
                                        </div>
                                ):(
                                    <>
                                        {questions[currentQuestion].audio?(

                                            <div className='w-full h-full bg-gray-700 flex justify-center items-center px-2'>
                                                <audio controls autoPlay={true}>
                                                    <source src={questions[currentQuestion].audio} type="audio/ogg" />
                                                    <source src={questions[currentQuestion].audio} type="audio/mpeg" />
                                                </audio>
                                            </div>
                                            ):(
                                                <></>
                                            )}
                                    </>
                                )}
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
                        <>
                        {questions[currentQuestion].question_type === "quiz"?(
                            <>
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
                            </>
                        ):(
                            <>
                            {isAnsweredOpenEnded?(
                                <>
                                <div className="w-full bg-white shadow-lg p-4 rounded">
                                    <form onSubmit={submitOpenendedAnswer}>
                                        <textarea disabled className="w-full border border-green-400 focus:outline-none p-4 rounded" name="open_ended_answer" placeholder="Write answer here..." required>
                                        </textarea>
                                    <button disabled className="px-4 py-2 bg-green-600 text-white font-medium rounded mt-2">Submit Answer</button>
                                    </form>
                                </div>
                                </>
                            ):(
                                <>
                                <div className="w-full bg-white shadow-lg p-4 rounded">
                                    <form onSubmit={submitOpenendedAnswer}>
                                        <textarea className="w-full border border-green-400 focus:outline-none p-4 rounded" name="open_ended_answer" placeholder="Write answer here..." required>
                                        </textarea>
                                    <button className="px-4 py-2 bg-green-600 text-white font-medium rounded mt-2">Submit Answer</button>
                                    </form>
                                </div>
                                </>
                            )}
                            </>
                        )}
                            
                        </>
                        )}
                        </div>
                         
                         
                         
                         
                         </>)}
                            
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
