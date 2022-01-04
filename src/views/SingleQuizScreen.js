import React, { useState, useEffect } from 'react'
import { Link, useParams  } from 'react-router-dom';
import authorizedApi from '../api/authorizedApi';
import Header from '../components/Header';

export default function SingleQuizScreen() {
    let params = useParams();
    const [quiz,setQuiz] = useState({});
    const [questions,setQuestions] = useState([]);
    const [isShow,setIsShow] = useState(false);
    const [selectedId,setSelectedId] = useState("");
    const [user,setUser] = useState({});
    const loadUser = async ()=>{
        const {data} = await authorizedApi.get('/auth/user');
        setUser(data);
    }



    const handleIsShow =(id)=>{
      if(selectedId == id){
        setIsShow(!isShow);
      }else{
      setSelectedId(id);
      setIsShow(true);
      }
    }
    const loadQuiz = async ()=>{
        await authorizedApi.post('/get/quiz',{
            id:params.id
        }).then((res)=>{
          setQuiz(res.data)
          setQuestions(res.data.questions);
        }).catch((err)=>{
          console.log(err);
        })
        // setQuiz(data);
        // console.log(data.quiz);
    }
    useEffect(()=>{
        loadUser();
        loadQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <div>
            <Header user={user} />
        <div className="max-w-sm md:max-w-4xl lg:max-w-6xl mx-auto">
            <div className='flex flex-col lg:flex-row justify-between mt-5'>
            <div className="w-full lg:w-1/4 mr-4">
                    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <img className="rounded-t-lg" src="https://flowbite.com/docs/images/blog/image-1.jpg" alt={quiz.title}/>
                        <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{quiz.title}</h5>
                            <Link to="/" className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Start
                            <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </Link>
                        </div>
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
                          {isShow && item.id == selectedId?(
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
</div>
    )
}