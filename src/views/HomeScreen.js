import { useState, useEffect } from 'react'
import Header from '../components/Header'
import authorizedApi from '../api/authorizedApi'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { differenceInCalendarDays } from 'date-fns'
export default function HomeScreen() {
    const [user,setUser] = useState({});
    const [myLibrary,setMyLibrary] = useState([]);
    const [myAssignment,setMyassignment] = useState([]);
    const loadUser = async ()=>{
        const {data} = await authorizedApi.get('/auth/user');
        setUser(data);
    }
   

    const loaduserInfo = async()=>{
        await authorizedApi.get('/my-library').then((res)=>{
            setMyLibrary(res.data.mylibrary);
            setMyassignment(res.data.myassignment);
        }).catch(err=>{
            alert("Please Check Internet Connection!");
        })
        
    }
    useEffect(()=>{
        loaduserInfo();
        loadUser();

    },[])
    return (
        <div className='bg-gray-100 min-h-screen'>
            <Header user={user} />
            <div className='max-w-sm md:max-w-3xl lg:max-w-7xl mx-auto flex flex-col md:flex-row gap-3 mt-5'>
                <div className='flex flex-col w-full md:w-1/3'>
                <div className='bg-white border rounded'>
                    <div className='p-3'>
                    <div>
                        <p className='text-lg font-bold text-blue-800'>{user.name}</p>
                    </div>
                    <div className=''>
                        <p className='text-sm text-gray-600 font-bold'>{user.email}</p>
                    </div>
                    </div>
                    <div className='flex flex-col gap-1 p-3'>
                        <div className='bg-gray-200 px-3 py-1 rounded flex flex-row justify-between items-center'>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>Plan:</p>
                            <p className='text-sm text-gray-600 font-bold underline cursor-pointer'>Upgrade</p>
                        </div>
                        <div className='bg-gray-200 px-3 py-1 rounded flex flex-row justify-between items-center'>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>Member of:</p>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>Location</p>
                        </div>
                        <div className='bg-gray-200 px-3 py-1 rounded flex flex-row justify-between items-center'>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>My interests:</p>
                            <p className='text-sm text-gray-600 font-bold underline cursor-pointer'>Add Interests</p>
                        </div>
                        <div className='flex flex-col gap-2 mt-5'>
                            <div className='bg-gray-200 px-3 py-1 rounded flex flex-row justify-between items-center'>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>Total Quiz</p>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>({myLibrary.length})</p>
                            </div>
                            <div className='bg-gray-200 px-3 py-1 rounded flex flex-row justify-between items-center'>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>Total Playes</p>
                            <p className='text-sm text-gray-600 font-bold cursor-pointer'>({0})</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='bg-white border rounded mt-5'>
                    <div className='p-3'>
                    <div>
                        <p className='text-lg font-bold text-gray-800'>Assignment ( {myAssignment.length} )</p>
                    </div>
                    </div>
                    {myAssignment.slice(0, 5).map((item)=>{
                        return <Link to={`/reports/challenge/${item.quizId}/${item._id}`}>
                        <div className='flex flex-row justify-start items-center gap-1 ml-5'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        <div className='px-3 py-1 rounded flex flex-col items-center'>
                            <p className='text-sm text-blue-600 font-bold cursor-pointer'>Ends in {differenceInCalendarDays(new Date(item.endDate), new Date())} days</p>
                            <p className='text-base text-gray-600 font-bold underline cursor-pointer'>{item.title}</p>
                        </div>
                    </div>
                    </Link>
                    })}


                </div>
                </div>
                <div className='w-full bg-white border rounded px-4 pb-5'>
                <div className='grid grid-cols-4 gap-5 mt-5'>
            {myLibrary.map((item)=>{
                return(
                        <Link key={item._id} to={{
                            pathname:`/quiz/details/${item._id}`,
                            data: item
                            }}>
                            <motion.div 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.9 }}
                            className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src="https://v1.tailwindcss.com/img/card-top.jpg" alt="Sunset in the mountains" />
                            <div className="px-2 py-4">

                            <div className='flex flex-row items-center gap-2'>
                                <div className='flex justify-center items-center w-8 h-8 bg-red-400 rounded-full'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className='text-base font-bold text-gray-600'>{item.title}</p>
                                    <p className='text-xs text-gray-600 font-bold'>{user.name}</p>
                                </div>
                            </div>
                            </div>
                            {/* <div className="px-6 pt-4 pb-2">
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
                                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
                            </div> */}
                            </motion.div>

                        </Link>
                )
            })}
            </div>
                </div>
                {/* <div className='w-full md:w-1/3 bg-white border rounded'>
                    <div className='p-3'>
                        <ul className='flex flex-row justify-start gap-3 cursor-pointer'>
                            <li className='text-sm font-bold text-gray-500'>My Challenge</li>
                            <li className='text-sm font-bold text-gray-500'>Team Space</li>
                        </ul>
                       
                    </div>
               </div> */}
            </div>
        </div>
    )
}
