import { useEffect, useState } from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import socket from '../socket/socket';
import {ClockLoader} from 'react-spinners';
import { motion } from 'framer-motion';
import swal from 'sweetalert';
import CountUp from 'react-countup';
import correct_audio from '../audio/correct.mp3';
import wrong_audio from '../audio/wrong.mp3';
export default function PlayGameScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [player,setPlayer] = useState({});
    const [isStart,setIsStart] = useState(false);
    const [isDelay,setIsDelay] = useState(false);
    const [currentQuestion,setCurrentQuestion] = useState({});
    const [points,setPoints] = useState(0);
    const [isShowTimer,setisShowTimer] = useState(true);
    const [isAnswered,setisAnswered] = useState(false);
    const [isAnsweredOpenEnded,setisAnsweredOpenEnded] = useState(false);
    const [isRoundStart,setisRoundStart] = useState(false);
    const [isShowCurrectAnswerMessage,setisShowCurrectAnswerMessage] = useState(false);
    const [isShowWrongAnswerMessage,setisShowWrongAnswerMessage] = useState(false);
    const [firstRightAnsweredNotYet,setfirstRightAnsweredNotYet] = useState(true);
    const [recentPointsAdd,setRecentPointsAdd] = useState(0);
    const [isShowResult,setisShowResult] = useState(false);
    const [results,setResult] = useState([]);

    const submitAnswer = (answer)=>{
      setisAnswered(true);
      setisShowTimer(false);
      if(answer === currentQuestion.answer){
          if(firstRightAnsweredNotYet){
              setPoints(points + parseInt(currentQuestion.points_frans?currentQuestion.points_frans:"0"));
              setfirstRightAnsweredNotYet(false);
              setRecentPointsAdd(currentQuestion.points_frans);
              const data = {
                points: points + parseInt(currentQuestion.points_frans?currentQuestion.points_frans:"0"),
                answer: answer
              }
              socket.emit('submit_answer',(data));
          }else{
              setPoints(points + parseInt(currentQuestion.points_remaining?currentQuestion.points_remaining:"0"));
              setRecentPointsAdd(currentQuestion.points_remaining);
              const data = {
                points: points + parseInt(currentQuestion.points_remaining?currentQuestion.points_remaining:"0"),
                answer: answer
              }
              socket.emit('submit_answer',(data));
          }
          setTimeout(()=>{
              setisShowCurrectAnswerMessage(true);
          },400);
          

      }else{
          setTimeout(()=>{
              setisShowWrongAnswerMessage(true);
          },400);
          const data = {
            points: points,
            answer: answer
          }
          socket.emit('submit_answer',(data));
      }
  }

  const submitOpenendedAnswer =(event)=>{
    event.preventDefault();
    setisShowTimer(false);
    setisAnsweredOpenEnded(true);
    var answer = event.target.open_ended_answer.value;
    var exits_answer = currentQuestion.open_ended_option.includes(answer);
    if(exits_answer){
        if(firstRightAnsweredNotYet){
            setPoints(points + parseInt(currentQuestion.points_frans?currentQuestion.points_frans:"0"));
            setfirstRightAnsweredNotYet(false);
            setRecentPointsAdd(currentQuestion.points_frans?currentQuestion.points_frans:"0");
            const data = {
              points: points + parseInt(currentQuestion.points_frans?currentQuestion.points_frans:"0"),
              answer: answer
            }
            socket.emit('submit_answer',(data));
            
          }else{
            setPoints(points + parseInt(currentQuestion.points_remaining?currentQuestion.points_remaining:"0"));
            setRecentPointsAdd(currentQuestion.points_remaining?currentQuestion.points_remaining:"0");
            const data = {
              points: points + parseInt(currentQuestion.points_remaining?currentQuestion.points_remaining:"0"),
              answer: answer
            }
            socket.emit('submit_answer',(data));
          }
        setTimeout(()=>{
            setisShowCurrectAnswerMessage(true);
        },400);
    }else{
        setTimeout(()=>{
            setisShowWrongAnswerMessage(true);
        },400);
        const data = {
          points: points,
          answer: answer
        }
        socket.emit('submit_answer',(data));
    }

}
  useEffect(()=>{
    socket.on('getting_ready',()=>{
      setIsDelay(true);
      setTimeout(()=>{
        setIsDelay(false);
        setIsStart(true);
      },5000);
    });
  },[]);
  useEffect(()=>{
    socket.on('game_is_running',(question)=>{
      setisRoundStart(true);
      setTimeout(()=>{
        setisRoundStart(false);
      },3000);
      setCurrentQuestion(question);
    });
  },[]);

  useEffect(()=>{
    socket.on('new_question_accept',(question)=>{
      setisRoundStart(true);
      setTimeout(()=>{
        setisRoundStart(false);
      },3000);
      setCurrentQuestion(question);
      setisShowCurrectAnswerMessage(false);
      setisShowWrongAnswerMessage(false);
      setisAnswered(false);
      setisAnsweredOpenEnded(false);
      setisShowTimer(true);
      
    });
  },[currentQuestion]);

  useEffect(()=>{
    socket.on('accept_result',(result)=>{
      setResult(result);
      setisShowResult(true);
    });
  },[]);

  const TimesUp = ()=>{
    setisAnswered(true);
    setisShowTimer(false);
    swal({
      title: "Times Up",
      icon: "warning",
      button: "Next",
    });
  }

  useEffect(()=>{
    if(location.state === "null"){
      navigate('/join',{ replace: true });
    }else{
      setPlayer(location.state);
    }
  },[location.state, navigate]);

  useEffect(()=>{
    socket.on('admin_left',()=>{
      swal({
        title: "Host Disconnected!!",
        icon: "warning",
        button: "Next",
      });
      navigate('/join',{ replace: true });
    });
  })

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      navigate('/join',{ replace: true });
      return ()=>{
        socket.emit('disconnect');
        socket.off();
    }
  };
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  });

  return (
    <div>
      {isShowResult?(<>
        <div className="bg-blue-700 min-h-screen flex flex-col items-center overflow-hidden">
            <div className="flex w-full py-3 justify-center shadow-md bg-white items-center">
                <p className="font-bold text-4xl text-gray-700">Scoreboard</p>
            </div>
            <div className="w-full">
            <div className="max-w-sm md:max-w-2xl lg:max-w-5xl p-4 rounded shadow-inner bg-blue-900 mx-auto mt-10 md:px-28">
            {results.sort((a,b)=> (a.points> b.points)?-1:1).map((item,i)=>{
                return <div className={item.name === player.name ? "py-2 bg-white rounded mt-3": "py-2 mt-3"}>
                  <div className="flex flex-row justify-between items-center gap-4 px-10">
                      <div className="flex flex-row items-center gap-4">
                      <p className={item.name === player.name ?"text-gray-700 font-bold text-xl":"text-white font-bold text-xl"}>{i+1}</p>
                      <p className={item.name === player.name ?"text-gray-700 font-bold text-xl":"text-white font-bold text-xl"}>{item.name}</p>
                      </div>
                      <p className={item.name === player.name ?"text-gray-700 font-bold text-xl":"text-white font-bold text-xl"}><CountUp duration={1} end={item.points} /></p>
                  </div>
                </div>
            })}
            </div>
            </div>
            </div>
      </>):(<>
      {isStart?(<>

        {isRoundStart?(<>
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
                  className="text-2xl font-bold text-orange-600">Round {currentQuestion.round} {currentQuestion.question_type === "quiz"?"Quiz":"Open-ended"}
                  </motion.p>
                                        
              </motion.div>
                                            
            </div>
        </>):(<>
        
        <div className="flex w-full py-6 justify-center shadow-md bg-white items-center">
            <p className="font-bold text-2xl text-gray-600">{currentQuestion.question}</p>
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
            <div className={isShowTimer?"w-16 h-16 md:w-20 md:h-20 bg-green-600 text-white text-3xl font-bold flex justify-center items-center rounded-full":"bg-white w-20 h-20"}>
                  {isShowTimer?(
                      <>
                        <CountUp 
                        start={currentQuestion.time_limit}
                        end={0}
                        duration={currentQuestion.time_limit}
                        onEnd={()=>TimesUp()}
                        />
                      </>
                    ):(
                      <></>
                    )}
            </div>
                  <div className='w-60 h-40 flex justify-center items-center overflow-hidden text-center mx-auto rounded md:w-72 md:h-48 bg-white shadow-lg mt-5'>
                   
                      {currentQuestion.image?(
                            <div>
                              <img src={currentQuestion.image?currentQuestion.image:""} style={{width:"100%",height:"100%"}} alt="qimage" />
                            </div>
                          ):(
                              <>
                                  {currentQuestion.audio?(
                                        <div className='w-full h-full bg-gray-700 flex justify-center items-center px-2'>
                                          <audio controls autoPlay={true}>
                                                <source src={currentQuestion.audio} type="audio/ogg" />
                                                <source src={currentQuestion.audio} type="audio/mpeg" />
                                          </audio>
                                        </div>
                                      ):(
                                      <></>
                                    )}
                                </>
                              )}
                      </div>

            </div>                                 
            <div className="max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto mt-10">
                        {isAnswered?(
                        <div className='grid grid-cols-2 gap-4 mt-5'>
                            <div className={currentQuestion.answer === "a" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{currentQuestion.option1}</div>
                            
                            <div className={currentQuestion.answer === "b" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{currentQuestion.option2}</div>
                            <div className={currentQuestion.answer === "c" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{currentQuestion.option3}</div>
                            <div className={currentQuestion.answer === "d" ? 'bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center':'bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold flex justify-center'}>{currentQuestion.option4}</div>
                         </div>
                        ):(
                        <>
                        {currentQuestion.question_type === "quiz"?(
                            <>
                                <div className='grid grid-cols-2 gap-4 mt-5'>
                                <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={()=>submitAnswer("a")}
                                >
                                    <button className="bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{currentQuestion.option1}</button>
                                </motion.div>
                                <motion.div 
                                whileHover={{ scale: 1.02 }}
                                onClick={()=>submitAnswer("b")}>
                                    <button className="bg-blue-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{currentQuestion.option2}</button>
                                </motion.div>
                                <motion.div 
                                whileHover={{ scale: 1.02 }}
                                onClick={()=>submitAnswer("c")}>
                                    <button className="bg-yellow-500 border-2 w-full py-4 rounded text-xl text-white font-bold">{currentQuestion.option3}</button>
                                </motion.div>
                                <motion.div 
                                whileHover={{ scale: 1.02 }}
                                onClick={()=>submitAnswer("d")}>
                                    <button className="bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{currentQuestion.option4}</button>
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
  
      </>):(<>
        {!isDelay?(<>
          <div className='bg-blue-700 min-h-screen flex justify-center items-center'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <p className='text-3xl font-bold text-gray-100 shadow-md'>You are in!</p>
            <div className='bg-blue-800 p-3 rounded'>
                <p className='text-xl font-bold text-gray-100 shadow-md'>Waiting for start...</p>
            </div>
          </div>
          </div>
        </>):(<>
        <div className='bg-blue-700 min-h-screen flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center gap-2'>
              <div className='flex flex-col items-center gap-4'>
                <p className='text-2xl font-bold text-white'>Getting Ready</p>
                  <ClockLoader loading={true} color={"#fff"} size={60} margin={2} />
              </div>
        </div>
        </div>

        </>)}

      </>)}
  </>)}


      <nav className='bg-blue-900 fixed bottom-0 inset-x-0 h-12 px-6 justify-between flex items-center z-50'>
        <p className='text-lg font-bold text-white'>{player.name}</p>
        <div className='bg-gray-800 px-2 rounded flex items-center justify-center'>
        <p className='text-lg font-bold text-white'>{points}</p>
        </div>
      </nav>
    </div>
  )
}
