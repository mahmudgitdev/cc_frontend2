import {useState, useCallback, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import authorizedApi from '../api/authorizedApi';
import { motion } from "framer-motion"
import swal from 'sweetalert';
import ClipLoader from "react-spinners/ClipLoader";
export default function CreateScreen() {

    const navigate = useNavigate();
    const questionEndRef = useRef(null)
    const scrollToBottom = () => {
        questionEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    const defaultQuestion = {
        id:123456,
        question: "",
        image: "",
        option1:"",
        option2:"",
        option3:"",
        option4:"",
        answer:""
    }
    const [quiz_title,setQuizTitle] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isTitleModal,setIsTitleModal] = useState(false);
    const [imgModalIsOpen,setimgModalIsOpen] = useState(false);
    const [currentQuestions,setCurrentQuestions] = useState(defaultQuestion);
    const [defaultEmptyQuestion,setDefaultEmptyQuestion] = useState([defaultQuestion]);
    const [showop1,setShowop1] = useState(false);
    const [showop2,setShowop2] = useState(false);
    const [showop3,setShowop3] = useState(false);
    const [showop4,setShowop4] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    

    const handleImageUpload = async(e)=>{
        closeimgModalIsOpen(false);
        setIsLoading(true);
        var formData = new FormData();
        formData.append('image', e.target.files[0]);
        await authorizedApi.post('/api/actions/upload',formData).then((res)=>{
            defaultEmptyQuestion.find((item)=>{return item.id === currentQuestions.id ? item.image = res.data:''})
            setCurrentQuestions({...currentQuestions,image:res.data});
            setIsLoading(false);
        })
    }

    const openImageUpload = ()=>{
        setimgModalIsOpen(true);
    }

    const handleSave = async()=>{
        await authorizedApi.post('/api/actions/save/qq',{
            title: quiz_title,
            questions: defaultEmptyQuestion
        }).then((res)=>{
            if(res.data.success){
                navigate('/profile');
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const setAnswer = (answer)=>{
        defaultEmptyQuestion.find((item)=>{return item.id === currentQuestions.id ? item.answer = answer:''})
        setCurrentQuestions({...currentQuestions,answer:answer});
    }
    const handleEnterQuestion = (event)=>{
        defaultEmptyQuestion.find((item)=>{return item.id === currentQuestions.id ? item.question = event.target.value:''})
        setCurrentQuestions({...currentQuestions,question:event.target.value});
    }
    const handleEnterOptionA = (event)=>{
        defaultEmptyQuestion.find((item)=>{return item.id === currentQuestions.id ? item.option1 = event.target.value:''})
        setCurrentQuestions({...currentQuestions,option1:event.target.value});
    }
    const handleEnterOptionB = (event)=>{
        defaultEmptyQuestion.find((item)=>{return item.id === currentQuestions.id ? item.option2 = event.target.value:''})
        setCurrentQuestions({...currentQuestions,option2:event.target.value});
    }
    const handleEnterOptionC = (event)=>{
        defaultEmptyQuestion.find((item)=>{return item.id === currentQuestions.id ? item.option3 = event.target.value:''})
        setCurrentQuestions({...currentQuestions,option3:event.target.value});
    }
    const handleEnterOptionD = (event)=>{
        defaultEmptyQuestion.find((item)=>{return item.id === currentQuestions.id ? item.option4 = event.target.value:''})
        setCurrentQuestions({...currentQuestions,option4:event.target.value});
    }
    const setCurrentQuestion = (item)=>{
        setCurrentQuestions(item);
    }
    const deleteQuestion =(id)=>{
        swal({
            title: "Quiz Delete Confirmation",
            text: "Are you sure you want to delete this question?",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                setDefaultEmptyQuestion(defaultEmptyQuestion.filter((item)=> item.id !== id));
                setCurrentQuestion({});
            }
          });
        
    }
    const addQuestion = ()=>{
        const newEmptyQuestion = {
            id: Math.floor(1 + (Math.random() * (9999-1))),
            question: "Question Title",
            image: "",
            option1:"",
            option2:"",
            option3:"",
            option4:"",
            answer:""
        }
        setDefaultEmptyQuestion([...defaultEmptyQuestion,newEmptyQuestion]);
    }

    const showOption = (option)=>{
        if(option === "a"){
            setShowop1(true)
        }else if(option === "b"){
            setShowop2(true)
        }else if(option === "c"){
            setShowop3(true)
        }else if(option === "d"){
            setShowop4(true)
        }
    }
    const continueModal = async ()=>{
        if(quiz_title.length === 0){
            setIsOpen(true);
        }else{
            handleSave();
        }
        
    }

    const openTitleModal = ()=>{
        setIsTitleModal(true)
    }
    const closeTitleModal = ()=>{
        setIsTitleModal(false)
    }
    const customStyles = {
        content: {
          top: '40%',
          left: '45%',
          right: 'auto',
          bottom: 'auto',
          width: '70%',
          marginRight: '-50%',
          transform: 'translate(-40%, -50%)',
          boxShadow: '0px 0px 18px -4px #333'
        },
      };
    const uploadStyle = {
        content: {
          top: '50%',
          left: '45%',
          right: 'auto',
          bottom: 'auto',
          width: '50%',
          marginRight: '-50%',
          transform: 'translate(-40%, -50%)',
          boxShadow: '0px 0px 18px -4px #333'
        },
      };
    const closeModal =()=>{
        setIsOpen(false);
      }
    const closeimgModalIsOpen = ()=>{
        setimgModalIsOpen(false);
    }
    const exit = ()=>{
        navigate('/')
    }
    useEffect(scrollToBottom, [defaultEmptyQuestion]);

    return (
        <div className='bg-gray-100 min-h-screen'>
            {/* header */}
                   <nav className="bg-white shadow-md px-6 py-3">
                            <div className="w-full mx-auto">
                                <div className="flex items-center justify-center lg:justify-between relative">

                                   <div className='flex items-center'>
                                       <div className='px-2'>
                                           <p className='text-xl font-bold text-gray-800'>ChampionChallenger</p>
                                       </div>
                                       <button 
                                       onClick={openTitleModal} 
                                       className='w-60 p-2 border border-gray-400 font-bold text-gray-600 rounded focus:outline-none'>
                                         {quiz_title?quiz_title:"Enter Quiz Title...."}
                                       </button>
                                   </div>
                                    <div className="flex flex-row items-center justify-between">
                                        <button onClick={exit} className="w-16 p-2 bg-gray-200 mr-4 shadow-md text-gray-600 rounded font-bold">
                                            Exit
                                        </button>
                                        <button onClick={continueModal} className="w-24 p-2 bg-gray-700 mr-4 shadow-md text-white rounded font-bold">
                                            Save
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                    </nav>
                {/* header-close */}

                {/* modal */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    >
                <div>
                    <div>
                      <h1 className='text-lg text-gray-800 font-bold'>Need some more! finishing touches!</h1>
                    </div>
                    <div className='flex justify-center'>
                        <p  className='text-base text-gray-600 font-medium'>Enter the title of your quiz!</p>
                    </div>

                    <div className='py-10'>
                        <label className='text-base font-bold text-gray-700'>Title</label>
                        <input onChange={(e)=>setQuizTitle(e.target.value)} className='w-full border border-gray-400 focus:outline-none p-2 rounded' type="text" placeholder='Enter quiz title...' />
                    </div>
                    <div className='flex flex-row justify-evenly items-center'>
                        <button onClick={closeModal} className='bg-red-500 w-20 p-2 rounded text-white text-sm font-bold'>Cancel</button>
                        <button onClick={handleSave} className='bg-green-700 w-20 p-2 rounded text-white text-sm font-bold'>Save</button>
                    </div>
                </div>

                </Modal>

                <Modal
                    isOpen={isTitleModal}
                    onRequestClose={closeTitleModal}
                    style={customStyles}
                    >
                <motion.div
                animate={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
                >
                    <div>
                      <h1 className='text-lg text-gray-800 font-bold'>Quiz summary</h1>
                    </div>
                    <div className='flex justify-center'>
                        <p className='text-base text-gray-600 font-medium'>Enter the title of your quiz!</p>
                    </div>

                    <div className='py-10'>
                        <label className='text-base font-bold text-gray-700'>Title</label>
                        <input onChange={(e)=>setQuizTitle(e.target.value)} defaultValue={quiz_title} className='w-full border border-gray-400 focus:outline-none p-2 rounded' type="text" placeholder='Enter quiz title...' />
                    </div>
                    <div className='flex flex-row justify-evenly items-center'>
                        <button onClick={closeTitleModal} className='bg-red-500 w-20 p-2 rounded text-white text-sm font-bold'>Cancel</button>
                        <button onClick={closeTitleModal} className='bg-green-700 w-20 p-2 rounded text-white text-sm font-bold'>Save</button>
                    </div>
                </motion.div>

                </Modal>

                <Modal
                    isOpen={imgModalIsOpen}
                    onRequestClose={closeimgModalIsOpen}
                    style={uploadStyle}
                    >
                    <div class="py-20 bg-white px-2">
                    <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                    <div className="md:flex">
                        <div className="w-full p-3">
                        <div className="relative h-48 rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
                            <div className="absolute">
                            <div className="flex flex-col items-center"> 
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 font-bold text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg> 
                            <span className="block text-gray-400 font-bold">Upload Image</span> </div>
                            </div> <input type="file" className="h-full w-full opacity-0" onChange={handleImageUpload} />
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>

                </Modal>
                

        <div className="flex">
            <div style={{height:"85vh"}} className="w-1/6 bg-white shadow-lg mt-5 pb-14 rounded overflow-y-auto">
                {defaultEmptyQuestion.map((item,i)=>{
                    return <motion.div 
                    animate={{ scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    onClick={()=>setCurrentQuestion(item)} key={i.toString()} 
                    className={currentQuestions.id === item.id?'bg-blue-200 px-4 py-4 cursor-pointer rounded-md':'bg-gray-200 px-4 py-4 cursor-pointer rounded-md'}>
                    <div className='p-2'>
                        <p className='text-sm font-bold text-gray-600'>{i+1} Quiz</p>
                    </div>
                    {currentQuestions.id === item.id?(
                        <div className='bg-white rounded flex flex-col justify-center items-center'>
                        <div className='py-0.5'>
                            <p className='text-gray-400 text-sm'>{currentQuestions.question?currentQuestions.question:"Question Title"}</p>
                        </div>
                        <div className='border border-dashed p-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        </div>

                        <div className='grid grid-cols-2 gap-2 py-2'>
                            <div className='border px-6 py-1'></div>
                            <div className='border px-6 py-1'></div>
                            <div className='border px-6 py-1'></div>
                            <div className='border px-6 py-1'></div>
                        </div>
                        <div onClick={()=>deleteQuestion(item.id)} title='Delete' className='flex mb-1 cursor-pointer w-6 h-6 bg-red-600 rounded-full justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                    </div>
                    ):(
                        <div key={i.toString()} className='bg-white rounded flex flex-col justify-center items-center'>
                        <div className='py-0.5'>
                            <p className='text-gray-400'>{item.question?item.question:"Question Title"}</p>
                        </div>
                        <div className='border border-dashed p-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        </div>

                        <div className='grid grid-cols-2 gap-2 py-2'>
                            <div className='border px-6 py-1'></div>
                            <div className='border px-6 py-1'></div>
                            <div className='border px-6 py-1'></div>
                            <div className='border px-6 py-1'></div>
                        </div>
                        <div onClick={()=>deleteQuestion(item.id)} title='Delete' className='flex mb-1 cursor-pointer w-6 h-6 bg-red-600 rounded-full justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                    </div>
                    )}
                    
                </motion.div>
                })}
                <div ref={questionEndRef}></div>
            <div className='fixed bottom-5 inset-x-10'>
                    <button onClick={addQuestion} className='bg-blue-800 shadow-lg rounded-md px-3 py-2 hover:bg-blue-700 hover:shadow-inner text-white font-bold'>
                        Add question
                    </button>
            </div>
        
        </div>
            



  {/*question creator*/}
  <div id="main-content" className="w-5/6 flex-1">
    <div className="flex flex-1 flex-wrap">
      <div className="w-full xl:w-2/3 p-6 xl:max-w-6xl">
        {/*"Container" for the graphs"*/}
        <div className="max-w-full lg:max-w-3xl xl:max-w-5xl">
          
        <div>
                <div className='bg-white shadow-lg rounded p-2'>
                    {/* <Editor editorState={editorState} onChange={setEditorState} placeholder='Start typing your questions...' /> */}
                <input onChange={handleEnterQuestion} key={currentQuestions.id} defaultValue={currentQuestions.question} className='w-full focus:outline-none text-center text-xl' type="text" placeholder='Start typing your questions...' />
                </div>

                <div className='flex justify-center items-center overflow-hidden text-center mx-auto rounded w-72 h-48 bg-white shadow-lg mt-5'>
                   
                   {currentQuestions.image?(
                        <div>
                            {
                                <div>
                                    <img src={currentQuestions.image?currentQuestions.image:""} style={{width:"100%",height:"100%"}} alt="qimage" />
                                </div>

                            }
                        </div>
                   ):(
                       <>
                       {isLoading?(
                         <ClipLoader loading={isLoading} color={"#324"} size={40} />
                       ):(
                        <div className='bg-blue-600 rounded p-3'>
                        <svg onClick={openImageUpload} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer text-white font-bold" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                   </div>
                       )}
                       </>
                   )}
                </div>

                <div className='grid grid-cols-2 gap-4 mt-5'>
                <div className={showop1?'bg-red-600 shadow-lg rounded p-6 relative':'bg-white shadow-lg rounded p-6'}>
                    {/* <Editor editorState={editorState} onChange={setEditorState} placeholder='Start typing your questions...' /> */}
                <input onFocus={()=>showOption("a")} onChange={handleEnterOptionA} key={currentQuestions.id} defaultValue={currentQuestions.option1} className='w-full bg-transparent focus:outline-none focus:placeholder-white text-white text-center text-lg py-1 rounded' type="text" placeholder='Add Answer 1' />
                {showop1?(
                    <motion.div
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                     onClick={()=>setAnswer("a")} className={currentQuestions.answer === "a"?'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-green-600 flex justify-center items-center':'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-white flex justify-center items-center hover:bg-green-600'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={currentQuestions.answer === "a"?"h-7 w-7 font-bold text-white":"h-7 w-7 opacity-0 hover:opacity-100 font-bold text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                ):(<></>)}
                </div>
                <div className={showop2?'bg-blue-600 shadow-lg rounded p-6 relative flex flex-row justify-between items-center':'bg-white shadow-lg rounded p-6 flex flex-row justify-between items-center'}>
                    {/* <Editor editorState={editorState} onChange={setEditorState} placeholder='Start typing your questions...' /> */}
                <input onFocus={()=>showOption("b")} onChange={handleEnterOptionB} key={currentQuestions.id} defaultValue={currentQuestions.option2} className='w-full bg-transparent text-white focus:placeholder-white focus:outline-none text-center text-lg' type="text" placeholder='Add Answer 2' />
                {showop2?(
                    <motion.div 
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={()=>setAnswer("b")} className={currentQuestions.answer === "b"?'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-green-600 flex justify-center items-center':'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-white flex justify-center items-center hover:bg-green-600'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={currentQuestions.answer === "b"?"h-7 w-7 font-bold text-white":"h-7 w-7 opacity-0 hover:opacity-100 font-bold text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                ):(<></>)}
                </div>
                <div className={showop3?'bg-yellow-500 shadow-lg rounded p-6 relative flex flex-row justify-between items-center':'bg-white shadow-lg rounded p-6 flex flex-row justify-between items-center'}>
                    {/* <Editor editorState={editorState} onChange={setEditorState} placeholder='Start typing your questions...' /> */}
                <input onFocus={()=>showOption("c")} onChange={handleEnterOptionC} key={currentQuestions.id} defaultValue={currentQuestions.option3} className='w-full bg-transparent focus:placeholder-white text-white focus:outline-none text-center text-lg' type="text" placeholder='Add Answer 3' />
                {showop3?(
                    <motion.div 
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={()=>setAnswer("c")} className={currentQuestions.answer === "c"?'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-green-600 flex justify-center items-center':'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-white flex justify-center items-center hover:bg-green-600'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={currentQuestions.answer === "c"?"h-7 w-7 font-bold text-white":"h-7 w-7 opacity-0 hover:opacity-100 font-bold text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                ):(<></>)}
                </div>
                <div className={showop4?'bg-green-800 shadow-lg rounded p-6 relative flex flex-row justify-between items-center':'bg-white shadow-lg rounded p-6 flex flex-row justify-between items-center'}>
                    {/* <Editor editorState={editorState} onChange={setEditorState} placeholder='Start typing your questions...' /> */}
                <input onFocus={()=>showOption("d")} onChange={handleEnterOptionD} key={currentQuestions.id} defaultValue={currentQuestions.option4} className='w-full bg-transparent focus:placeholder-white text-white focus:outline-none text-center text-lg' type="text" placeholder='Add Answer 4' />
                {showop4?(
                    <motion.div 
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={()=>setAnswer("d")} className={currentQuestions.answer === "d"?'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-green-600 flex justify-center items-center':'absolute cursor-pointer w-8 h-8 right-4 top-1/3 rounded-full bg-white flex justify-center items-center hover:bg-green-600'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={currentQuestions.answer === "d"?"h-7 w-7 font-bold text-white":"h-7 w-7 opacity-0 hover:opacity-100 font-bold text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                ):(<></>)}
                </div>
                </div>
                </div>




        </div>
      </div>
      <div className="w-full xl:w-1/3 p-6 xl:max-w-4xl border-l-1 border-gray-300 flex flex-col gap-4">
        <div>
            <div className='flex flex-row items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className='text-gray-600 text-base font-bold'>Question type</p>
            </div>
           
            <select className='w-full p-2 border border-gray-300 rounded' name="q_type">
                <option>Select Type</option>
                <option value="quiz">Quiz</option>
                <option value="puzzle">Puzzle</option>
            </select>
        </div>
        <div>
            <div className='flex flex-row items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
                <p className='text-gray-600 text-base font-bold'>Time Limits</p>
            </div>
           
            <select className='w-full p-2 border border-gray-300 rounded' name="time">
                <option value="quiz">Standard</option>
                <option value="puzzle">Standard Over</option>
            </select>
        </div>
        <div>
            <div className='flex flex-row items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                        <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                    </svg>
                <p className='text-gray-600 text-base font-bold'>Points</p>
            </div>
           
            <input className='w-full p-2 border border-gray-300 rounded' placeholder='Points' />
        </div>
      </div>
    </div>
  </div>

</div>

            
</div>
    )
}
