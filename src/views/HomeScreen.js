import { useState, useEffect } from 'react'
import Header from '../components/Header'
import authorizedApi from '../api/authorizedApi'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export default function HomeScreen() {
    const [user,setUser] = useState({});
    const [myLibrary,setMyLibrary] = useState([]);
    const loadUser = async ()=>{
        const {data} = await authorizedApi.get('/auth/user');
        setUser(data);
    }
   

    const loaduserInfo = async()=>{
        const {data} = await authorizedApi.get('/my-library');
        setMyLibrary(data);
    }
    useEffect(()=>{
        loaduserInfo();
        loadUser();
    },[])
    return (
        <div className='bg-gray-100 min-h-screen'>
            <Header user={user} />
            <div className='max-w-sm md:max-w-3xl lg:max-w-7xl mx-auto flex flex-col md:flex-row gap-3 mt-5'>
                <div className='w-full md:w-1/3 bg-white border rounded'>
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
                    {/* <div className='p-3'>
                        <div className='flex flex-row justify-between items-center'>
                            <p className='text-sm text-gray-500'>Apply for your verified profile today!</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className='p-3'>
                        <Link to="/profile" className='text-blue-600 font-bold cursor-pointer underline'>Go to profile</Link>
                    </div> */}
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
