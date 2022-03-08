import React, { useState, useEffect } from 'react'
import { useParams, useNavigate,Link  } from 'react-router-dom';
import authorizedApi from '../api/authorizedApi';
import Header from '../components/Header';
import Modal from 'react-modal';
import '../css/SingleQuiz.css';
import ClipLoader from "react-spinners/ClipLoader";
import { differenceInCalendarDays } from 'date-fns'

export default function SingleQuizScreen() {
    let params = useParams();
    const navigate = useNavigate();
    const [quiz,setQuiz] = useState({});
    const [questions,setQuestions] = useState([]);
    const [isShow,setIsShow] = useState(false);
    const [selectedId,setSelectedId] = useState("");
    const [user,setUser] = useState({});
    // const [modalIsOpen, setIsOpen] = useState(false);
    const [assignmodalIsOpen,setassignmodalIsOpen] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [endDate,setEndDate] = useState("");
    const [myAssignment,setMyassignment] = useState([]);
    const [isLoadingContent,setIsLoadingContent] = useState(true);
    const [randomOrder,setRandomOrder] = useState(false);
    
    const createAssignment = async()=>{
      setIsLoading(true);
      await authorizedApi.post('/api/actions/save/assignment',{
          title: quiz.title,
          randomOrder: randomOrder,
          quizId: quiz._id,
          endDate: endDate
      }).then((res)=>{
        if(res.data.success){
         setTimeout(()=>{
          navigate(`/reports/challenge/${quiz._id}/${res.data.data._id}`);
         },2000)
        }
      }).catch(err=>{
        console.log(err);
      })
  }


  const getAssignment = async()=>{
      await authorizedApi.post('/get/assignment/by_quizid',{
          id:params.id
      }).then((res)=>{
        setMyassignment(res.data)
      }).catch((err)=>{
        console.log(err);
      })
  }



    const loadUser = async ()=>{
        const {data} = await authorizedApi.get('/auth/user');
        setUser(data);
    }



    const handleIsShow =(id)=>{
      if(selectedId === id){
        setIsShow(!isShow);
      }else{
      setSelectedId(id);
      setIsShow(true);
      }
    }
    // const closeModal =()=>{
    //   setIsOpen(false);
    // }

    const closeAssignModal = ()=>{
      setassignmodalIsOpen(false)
    }
    const customStyles = {
      content: {
        top: '40%',
        left: '45%',
        right: 'auto',
        bottom: 'auto',
        width: '50%',
        marginRight: '-50%',
        transform: 'translate(-40%, -50%)',
        boxShadow: '0px 0px 18px -4px #333'
      },
    };
    const loadQuiz = async ()=>{
        await authorizedApi.post('/get/quiz',{
            id:params.id
        }).then((res)=>{
          setQuiz(res.data)
          setQuestions(res.data.questions);
          setIsLoadingContent(false);
        }).catch((err)=>{
          console.log(err);
        })
        // setQuiz(data);
        // console.log(data.quiz);
    }
    useEffect(()=>{
        loadUser();
        loadQuiz();
        getAssignment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <div>
            <Header user={user} />
            {/* <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
              <div>
                <h1 className='text-2xl font-bold text-gray-800 py-1'>Choose a way to play this Game</h1>
              <div className='flex justify-between items-center py-3'>
                <div className='bg-gray-200 p-2 text-center'>
                  <img className='w-full' src="https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286__340.png" alt="img" />
                <button className='w-32 py-2 bg-green-700 rounded text-white font-bold'>Start</button>
                </div>
                <div className='bg-gray-200 p-2 text-center'>
                  <img className='w-full' src="https://cdn.pixabay.com/photo/2015/12/15/06/42/kids-1093758__340.jpg" alt="img" />
                <button onClick={()=>setassignmodalIsOpen(true)} className='w-32 py-2 bg-green-700 rounded text-white font-bold'>Assign</button>
                </div>
              </div>
              </div>


            </Modal> */}

            <Modal
                isOpen={assignmodalIsOpen}
                onRequestClose={closeAssignModal}
                style={customStyles}
            >
              <div>
                <h1 className='text-2xl font-bold text-gray-800 py-1'>Create an assigned</h1>
                <div className='py-2 flex flex-col'>
                <label className='font-bold'>Players should complete it before:</label>
                <input onChange={(e)=>setEndDate(e.target.value)} className='border border-gray-500 py-1 px-2 rounded' type="datetime-local" />
                </div>

              <div className='py-2'>
                <p className='text-xl font-bold text-gray-800'>Options</p>
              </div>

            <div className='border-b'>

              <div className='flex flex-row justify-between py-1 border-b'>
              <p>Question timer</p>
              <label class="switch">
                <input type="checkbox" />
                <span class="slider"></span>
              </label>
              </div>

              <div className='flex flex-row justify-between py-1 border-b'>
              <p>Randomize answer order</p>
              <label class="switch">
                <input onChange={()=>setRandomOrder(!randomOrder)} type="checkbox" />
                <span class="slider"></span>
              </label>
              </div>

              <div className='flex flex-row justify-between py-1'>
              <p>Nickname generator</p>
              <label class="switch">
                <input type="checkbox" />
                <span class="slider"></span>
              </label>
              </div>

              </div>

              <div className='w-80 mx-auto flex items-center py-3'>
                <button onClick={closeAssignModal} className='w-32 py-2 bg-red-700 mr-2 rounded text-white font-bold'>Cancel</button>
                {isLoading?(
                  <>
                   <ClipLoader loading={isLoading} color={"#324"} size={40} />
                  </>
                ):(
                  <>
                  <button onClick={createAssignment} className='w-32 py-2 bg-green-700 rounded text-white font-bold'>Create</button>
                  </>
                )}
  
               
              </div>





              </div>


            </Modal>




        {isLoadingContent?(
        <>
          <div className='flex w-full min-h-screen justify-center items-center'>
          <ClipLoader loading={isLoadingContent} color={"#324"} size={40} />
          </div>
        </>
        ):(
        <>
        <div className="max-w-sm md:max-w-4xl lg:max-w-6xl mx-auto">
            <div className='flex flex-col lg:flex-row justify-between mt-5'>
            <div className="w-full lg:w-1/3 fex mr-4">
                    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <img className="rounded-t-lg" src={questions[0].image?questions[0].image:""} alt={quiz.title}/>
                        <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{quiz.title}</h5>
                            {myAssignment.length === 0?(
                              <>
                              <button onClick={()=>setassignmodalIsOpen(true)} className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                              Start
                              <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                              </button>
                              </>
                            ):(
                              <div className='flex flex-row gap-3 items-center'>
                              <Link to={`/play?quizid=${quiz._id}`}>
                              <button className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                              Start
                              </button>
                              </Link>
                              <button onClick={()=>setassignmodalIsOpen(true)} className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                              Assign
                              </button>
                              </div>
                            )}

                        </div>
                    </div>
                  <div className='bg-white border rounded mt-5'>
                    <div className='p-3'>
                    <div>
                        <p className='text-base font-bold text-gray-800'>Assignment of {quiz.title}</p>
                    </div>
                    </div>
                    {myAssignment.slice(0, 5).map((item)=>{
                        return <Link to={`/reports/challenge/${item.quizId}/${item._id}`}>
                        <div className='flex flex-row justify-start items-center gap-1 ml-5'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        <div className='px-3 py-1 rounded flex flex-col'>
                            <p className='text-sm text-blue-600 font-bold cursor-pointer'>Ends in {differenceInCalendarDays(new Date(item.endDate), new Date())} days</p>
                            <p className='text-base text-gray-600 font-bold underline cursor-pointer'>{item.title}</p>
                        </div>
                    </div>
                    </Link>
                    })}
                </div>
            </div>
            <div className="w-full lg:w-3/4">
                    <div className="border-b p-3">
                      <h5 className="font-bold text-black">Questions ({questions.length})</h5>
                    </div>
                    <div>
                      {questions.map((item,i)=>{
                        return <div className='p-4' key={item.id.toString()}>
                          <div onClick={()=>handleIsShow(item.id)} className='border border-gray-200 p-2 rounded-md cursor-pointer'>

                          <div className='flex flex-row justify-between'>
                            <div className='w-3/4'>
                            <p className='text-sm text-gray-500'>{i+1}-Quiz</p>
                            <p className='text-base text-gray-700 font-bold'>{item.question}</p>
                            </div>
                            <div className='w-1/6'>
                            <img className='w-full' src={item.image} alt={item.image} />
                            </div>
                          </div>
                          {isShow && item.id === selectedId?(
                          <div>
                          <div className='flex flex-row justify-between items-center py-2 border-b'>
                          <p className='text-base font-bold text-gray-600'>
                          a) {item.option1}
                          </p>
                          {item.answer === "a"?(<><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 font-bold" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg></>):(<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 font-bold" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>)}
                          </div>
                          <div className='flex flex-row justify-between items-center py-2 border-b'>
                          <p className='text-base font-bold text-gray-600'>
                          b) {item.option2}
                          </p>
                          {item.answer === "b"?(<><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 font-bold" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg></>):(<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 font-bold" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>)}
                          </div>
                          <div className='flex flex-row justify-between items-center py-2 border-b'>
                          <p className='text-base font-bold text-gray-600'>
                          c) {item.option3}
                          </p>
                          {item.answer === "c"?(<><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 font-bold" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg></>):(<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 font-bold" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>)}
                          </div>
                          <div className='flex flex-row justify-between items-center py-2 border-b'>
                          <p className='text-base font-bold text-gray-600'>
                          d) {item.option1}
                          </p>
                          {item.answer === "d"?(<><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 font-bold" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg></>):(<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 font-bold" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>)}
                          </div>
                            </div>
                          ):(<></>)}
                          
                          </div>
                        </div>
                      })}
                    </div>
            </div>
  </div>
</div>
</>)}



</div>
    )
}
