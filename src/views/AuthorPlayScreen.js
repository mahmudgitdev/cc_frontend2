import { useEffect, useState, useReducer } from 'react';
import {useLocation} from 'react-router-dom';
import { motion } from 'framer-motion';
import authorizedApi from '../api/authorizedApi';
import socket from '../socket/socket';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {ClockLoader} from 'react-spinners';
import CountUp from 'react-countup';
// import swal from 'sweetalert';
const reducerFunction =(state,action)=>{
    switch(action.type){
      case 'increament_a':
        return{
          ...state,
          option1: state.option1 + 1
        }
      case 'increament_b':
        return{
          ...state,
          option2: state.option2 + 1
        }
      case 'increament_c':
        return{
          ...state,
          option3: state.option3 + 1
        }
      case 'increament_d':
        return{
          ...state,
          option4: state.option4 + 1
        }
      case 'setOpenended_answer':
        return{
          ...state,
          openEndedAnswer:[...state.openEndedAnswer,action.payload]
        }
      case 'reset':
        return{
          ...state,
          option1: state.option1 = 0,
          option2: state.option2 = 0,
          option3: state.option3 = 0,
          option4: state.option4 = 0,
          openEndedAnswer: state.openEndedAnswer = []
        }
      default:
        return state
    }
}
const initialState = {
  option1:0,
  option2:0,
  option3:0,
  option4:0,
  openEndedAnswer:[]
}

export default function AuthorPlayScreen() {
    const [state,dispatch] = useReducer(reducerFunction,initialState)

    let location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let quizid = queryParams.get('quizid');
    // const [resource,setResource] = useState({});
    const [questions,setQuestions] = useState([]);
    const [isCopiyed,setIsCopied] = useState(false);
    const [players,setPlayers] = useState([]);
    const [responsePlayers,setResponsePlayers] = useState([]);
    const [gamepin,setGamePin] = useState('');
    const [round1Questions,setRound1Questions] = useState([]);
    const [round2Questions,setRound2Questions] = useState([]);
    const [round3Questions,setRound3Questions] = useState([]);
    const [currentQuestion,setCurrentQuestion] = useState(0);
    const [isRunning,setIsRunning] = useState(false);
    const [isShowTimer,setisShowTimer] = useState(true);
    const [isLoading,setIsLoading] = useState(false);
    const [isShowScoreBoard,setisShowScoreBoard] = useState(false);
    const [answeredPlayers,setansweredPlayers] = useState(0);
    const [isShowResult,setisShowResult] = useState(false);
    const [x,setX] = useState(0);
    const [currentResponse,setCurrentResponse] = useState({});
    const [isShowAnswer,setisShowAnswer] = useState(false);



    // const loadingResources = async()=>{
    //   const pin  = Math.floor(1 + (Math.random() * (9999-1)));
    //   await authorizedApi.post('/get/game_room/resources',{
    //     quiz_id: quizid,
    //     gamepin:pin,
    //   }).then((res)=>{
    //     setResource(res.data.resources);
    //     createGameRoom(pin);
    //   }).catch(err=>{
    //     console.log(err);
    //   })
    // }

    const loadQuiz = async()=>{
      await authorizedApi.post('/get/quiz',{
        id: quizid
      }).then((res)=>{
        setQuestions(res.data.questions);
        setRound1Questions([...round1Questions,...res.data.questions.filter((item)=> item.round === "1")]);
        setRound2Questions([...round2Questions,...res.data.questions.filter((item)=> item.round === "2")]);
        setRound3Questions([...round3Questions,...res.data.questions.filter((item)=> item.round === "3")]);
      }).catch(err=>{
        console.log(err);
      })
    }

    const createGameRoom = ()=>{
      const pin  = Math.floor(1 + (Math.random() * (9999-1)));
      setGamePin(pin);
      socket.emit('join',{author: `admin${pin.toString}` ,name: "roomadmin0304",room: pin});
    }

    const startGame = ()=>{
        socket.emit('getting_ready');
        setIsRunning(true);
        setIsLoading(true);
        setTimeout(()=>{
          socket.emit('start_game',(round1Questions[currentQuestion]));
          setIsLoading(false);
        },5000);
    }

    const showScoreBoard = ()=>{
      setisShowAnswer(false);
      setansweredPlayers(0);
      setisShowScoreBoard(true);
      setCurrentResponse("");
      dispatch({type: 'reset'});
    }

    const handleNext = ()=>{

      const nextQuestion = currentQuestion + 1;
      if(nextQuestion < questions.length){
        setCurrentQuestion(nextQuestion);
        socket.emit('new_question',(questions[nextQuestion]));
      }else{
        socket.emit('final_result',(responsePlayers));
        setisShowResult(true);
      }
      setisShowScoreBoard(false);
      setisShowTimer(true);
  }

    useEffect(()=>{
      // loadingResources();
      createGameRoom();
      loadQuiz();

    },[])

    useEffect(()=>{
      socket.on('new_player',(player)=>{
        setPlayers( players=> [ ...players, player ]);
      });

      socket.on("roomData", ({ players }) => {
        setPlayers(players);
      });
  },[]);


    useEffect(()=>{

      socket.on('accept_answer',({data})=>{

        setansweredPlayers( answeredPlayers=> answeredPlayers + 1 );

        switch(data.answer){
          case 'a':
          dispatch({type: 'increament_a'});
          break;
          case 'b':
          dispatch({type: 'increament_b'});
          break;
          case 'c':
          dispatch({type: 'increament_c'});
          break;
          case 'd':
          dispatch({type: 'increament_d'});
          break;
          default:
          dispatch({type: 'setOpenended_answer', payload: data.answer});
          break;
        }
        
        setCurrentResponse(data);

        setX(Math.floor(1 + (Math.random() * (9999-1))));

    });

    },[]);

    useEffect(()=>{
      if(!currentResponse.id){
      }else{
        var ifPlayer = responsePlayers.find((item)=> item.id === currentResponse.id);
        if(ifPlayer){
          responsePlayers.find((item)=>{return item.id === currentResponse.id ? item.points = currentResponse.points: ''});
        }else{
        setResponsePlayers([...responsePlayers,currentResponse]);
      }
    }
      
},[x]);

    const TimesUp = ()=>{
      // setisShowTimer(false);
      // alert("time up");
      setisShowAnswer(true);

    }
    useEffect(() => {
      const unloadCallback = (event) => {
        event.preventDefault();
        event.returnValue = "";
        return ()=>{
          socket.emit('disconnect');
          socket.off();
      }
      };
      window.addEventListener("beforeunload", unloadCallback);
      return () => window.removeEventListener("beforeunload", unloadCallback);
    },[]);



  return (
    <>
    {isShowResult?(<>
      <div className='bg-blue-700 min-h-screen flex flex-col items-center overflow-hidden'>
          <div className="flex w-full py-3 justify-center shadow-md bg-white items-center">
              <p className="font-bold text-2xl text-gray-700">Final Scoreboard</p>
          </div>
      
      <div className="w-full max-w-sm md:max-w-2xl lg:max-w-5xl p-4 rounded shadow-inner bg-blue-900 mx-auto mt-10 md:px-28">
            {responsePlayers.sort((a,b)=> (a.points> b.points)?-1:1).map((item,i)=>{
                return <div className="py-2 mt-3">
                  <div className="flex flex-row justify-between items-center gap-4 px-10">
                      <div className="flex flex-row items-center gap-4">
                      <p className="text-white font-bold text-xl">{i+1}</p>
                      <p className="text-white font-bold text-xl">{item.name}</p>
                      </div>
                      <p className="text-white font-bold text-xl">
                       <CountUp duration={1} end={item.points} />
                      </p>
                  </div>
                </div>
            })}
      </div>
      </div>

    </>):(<>
    {isRunning?(<>

      {isLoading?(<>
        <div className='bg-blue-800 min-h-screen overflow-hidden flex justify-center items-center'>
            <div>
              <div className='flex flex-col items-center gap-4'>
                <p className='text-2xl font-bold text-white'>Getting Ready</p>
                  <ClockLoader loading={true} color={"#fff"} size={60} margin={2} />
              </div>
            </div>
        </div>
      </>):(<>

        {isShowScoreBoard?(<>

          <div className="bg-blue-700 min-h-screen flex flex-col items-center overflow-hidden">
            <div className="flex w-full py-3 justify-center shadow-md bg-white items-center">
                <p className="font-bold text-3xl text-gray-700">Scoreboard</p>
            </div>
            <div className='w-full flex justify-end'>
              <motion.div
              whileHover={{ scale: 1.1 }}
              className='mr-5 mt-5'>
                  <button onClick={handleNext} className="px-4 py-2 bg-white rounded font-bold text-orange-600 text-base">Next</button>
              </motion.div>
            </div>
            <div className="w-full">
            <div className="max-w-sm md:max-w-2xl lg:max-w-5xl py-3 rounded shadow-inner bg-blue-900 mx-auto mt-10 md:px-28">
            {responsePlayers.sort((a,b)=> (a.points> b.points)?-1:1).map((item,i)=>{
                return <div key={item.id} className="py-2 mt-3">
                  <div className="flex flex-row justify-between items-center gap-4 px-10">
                      <div className="flex flex-row items-center gap-4">
                      <p className="text-white font-bold text-xl">{i+1}</p>
                      <p className="text-white font-bold text-xl">{item.name}</p>
                      </div>
                      <p className="text-white font-bold text-xl">
                       <CountUp duration={1} end={item.points} />
                      </p>
                  </div>
                </div>
            })}
            </div>
            </div>
            </div>
        
        </>):(<>
        <div className="flex w-full py-6 justify-center shadow-md bg-white items-center">
            <p className="font-bold text-2xl text-gray-600">{questions[currentQuestion].question}</p>
        </div>
        <div className="flex flex-row items-center justify-between max-w-sm mx-auto md:max-w-3xl lg:max-w-5xl">
            <div className={isShowTimer?"w-16 h-16 md:w-20 md:h-20 bg-green-600 text-white text-3xl font-bold flex justify-center items-center rounded-full":"bg-white w-20 h-20"}>
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
                  <div className='w-60 h-40 flex justify-center items-center overflow-hidden text-center mx-auto rounded md:w-72 md:h-48 bg-white shadow-lg mt-5'>
                   
                      {questions[currentQuestion].image?(
                            <div>
                              <img src={questions[currentQuestion].image?questions[currentQuestion].image:""} style={{width:"100%",height:"100%"}} alt="qimage" />
                            </div>
                          ):(
                              <>
                                  {questions[currentQuestion].audio?(
                                        <div className='w-full h-full bg-gray-700 flex justify-center items-center px-2'>
                                          <audio controls autoPlay={false}>
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
                      <motion.div
                      whileHover={{ scale: 1.1 }}
                      >
                        <button onClick={showScoreBoard} className="px-4 py-2 bg-green-700 rounded font-bold text-white text-base">Next</button>
                      </motion.div>

            </div>
            <div className='flex justify-center py-5'>
              <p className='text-lg font-bold text-orange-600'>Answered: {answeredPlayers}</p>
            </div>

            <div className='flex justify-center mt-3'>
              {questions[currentQuestion].question_type === "quiz"?(<>
              {isShowAnswer?(<>
                <div className='flex flex-row items-center gap-3'>
                {questions[currentQuestion].answer === 'a'?(<div className='flex flex-col items-center pb-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 font-bold text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  <div className='bg-red-600 w-16 h-8 flex flex-col justify-center items-center rounded'>
                    <p className='text-white font-bold text-lg'>{state.option1}</p>
                  </div>

                </div>):(<>
                  <div className='bg-red-600 w-16 h-8 flex justify-center items-center rounded'>
                     <p className='text-white font-bold text-lg'>{state.option1}</p>
                  </div>
                </>)}
                {questions[currentQuestion].answer === 'b'?(<div className='flex flex-col items-center pb-8'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 font-bold text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  <div className='bg-blue-600 w-16 h-8 flex flex-col justify-center items-center rounded'>
                    <p className='text-white font-bold text-lg'>{state.option2}</p>
                  </div>

                </div>):(<>
                  <div className='bg-blue-600 w-16 h-8 flex justify-center items-center rounded'>
                     <p className='text-white font-bold text-lg'>{state.option2}</p>
                  </div>
                </>)}
                {questions[currentQuestion].answer === 'c'?(<div className='flex flex-col items-center pb-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 font-bold text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  <div className='bg-yellow-600 w-16 h-8 flex flex-col justify-center items-center rounded'>
                    <p className='text-white font-bold text-lg'>{state.option3}</p>
                  </div>

                </div>):(<>
                  <div className='bg-yellow-600 w-16 h-8 flex justify-center items-center rounded'>
                     <p className='text-white font-bold text-lg'>{state.option3}</p>
                  </div>
                </>)}
                {questions[currentQuestion].answer === 'd'?(<div className='flex flex-col items-center pb-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 font-bold text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  <div className='bg-green-600 w-16 h-8 flex flex-col justify-center items-center rounded'>
                    <p className='text-white font-bold text-lg'>{state.option4}</p>
                  </div>

                </div>):(<>
                  <div className='bg-green-600 w-16 h-8 flex justify-center items-center rounded'>
                     <p className='text-white font-bold text-lg'>{state.option4}</p>
                  </div>
                </>)}
              </div>
              </>):(<>
                <div className='flex flex-row items-center gap-3'>
                <div className='bg-red-600 w-16 h-8 flex justify-center items-center rounded'>
                  <p className='text-white font-bold text-lg'>{state.option1}</p>
                </div>
                <div className='bg-blue-600 w-16 h-8 flex justify-center items-center rounded'>
                  <p className='text-white font-bold text-lg'>{state.option2}</p>
                </div>
                <div className='bg-yellow-600 w-16 h-8 flex justify-center items-center rounded'>
                  <p className='text-white font-bold text-lg'>{state.option3}</p>
                </div>
                <div className='bg-green-600 w-16 h-8 flex justify-center items-center rounded'>
                  <p className='text-white font-bold text-lg'>{state.option4}</p>
                </div>
              </div>
              </>)}

              </>):(<div className='flex flex-row items-center gap-2'>
              {state.openEndedAnswer.map((item)=>{
                return <div key={item.toString()}>
                    <div className='flex justify-center items-center px-2 py-1 bg-red-600 rounded'>
                        <p className='text-white font-bold text-base'>{item}</p>
                    </div>
                </div>
              })}
              </div>)}
            </div>    

            <div className="max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto mt-10">
                <>
                        {questions[currentQuestion].question_type === "quiz"?(
                            <>
                                <div className='grid grid-cols-2 gap-4 mt-5'>
                                <div>
                                  <button className="bg-red-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option1}</button>
                                </div>
                                <div>
                                    <button className="bg-blue-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option2}</button>
                                </div>
                                <div>
                                    <button className="bg-yellow-500 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option3}</button>
                                </div>
                                <div>
                                    <button className="bg-green-700 border-2 w-full py-4 rounded text-xl text-white font-bold">{questions[currentQuestion].option4}</button>
                                </div>
                                </div>
                            </>
                        ):(
                            <>
                            
                            </>
                        )} 
  
                </>
              </div>
              </>)}
          </>)}



    </>):(<>
    
      <div className='bg-blue-700 min-h-screen overflow-hidden'>
        <div className='bg-blue-900 py-4'>
          <div className='w-96 mx-auto rounded bg-white py-2 px-4 flex flex-row justify-between items-center'>
            <div className='px-2 flex flex-col'>
              <p className='text-sm font-bold'>Join at:</p>
              <p className='text-sm font-bold'>www.championchallenger.com</p>
            </div>
            <div className='flex flex-col'>
              <p className='text-base font-bold'>Game PIN:</p>
              <div title={isCopiyed?"Copied Link":"Copy Link to Share"} className='bg-gray-100 p-2 rounded'>
               <CopyToClipboard
               text={`http://localhost:3000/join?gamepin=${gamepin}`}
               onCopy={()=>setIsCopied(true)}
              >
              <p className='text-5xl font-bold cursor-pointer'>{gamepin}</p>
              </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-between mt-10 px-8 items-center'>
          <div>
            <div className='flex gap-2 items-center bg-blue-900 p-3 rounded'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <p className='text-2xl font-bold text-white'>{players.length}</p>
            </div>
          </div>
          <div>
            <div>
              <p className='text-xl lg:text-3xl font-bold text-white'>ChampionChallenger</p>
            </div>
          </div>

          <div>
            <button onClick={startGame} className='bg-blue-900 text-white rounded font-medium text-lg px-4 py-2'>Start</button>
          </div>
        </div>

        <div className='flex justify-center mt-12'>
          {players.length === 0?(
            <div className='bg-blue-800 p-3 rounded'>
                <p className='text-2xl font-bold text-gray-100'>Waiting for players...</p>
            </div>
          ):(
            <div className='flex flex-row gap-6 items-center'>
            {players.filter((player)=>player.name !== 'roomadmin0304').map((player)=>{
                  return <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1.1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  key={player.id} className='bg-blue-800 p-2 rounded'>
                  <p className='text-2xl font-bold text-gray-100'>{player.name}</p>
              </motion.div>
            })}

            </div>
          )}

        </div>
    </div>
    </>)}
  </>)}
    </>
  )
}
