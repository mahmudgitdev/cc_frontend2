import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Header from '../components/Header'
import authorizedApi from '../api/authorizedApi';
import { motion } from 'framer-motion';
export default function ProfileScreen() {
    const [user,setUser] = useState({});
    const [myLibrary,setMyLibrary] = useState([]);

    const loaduserInfo = async()=>{
        const {data} = await authorizedApi.get('/my-library');
        setMyLibrary(data);
    }
    const loadUser = async ()=>{
        const {data} = await authorizedApi.get('/auth/user');
        setUser(data);
    }
    useEffect(()=>{
        loadUser();
        loaduserInfo();
    },[])
    return (
        <div className='bg-gray-100 min-h-screen'>
            <Header user={user} />
            <div className='max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto'>
            <div className='flex flex-row justify-between items-center mt-5'>
                <div className='flex flex-row items-center gap-2'>
                    <div className='flex justify-center items-center w-14 h-14 bg-gray-400 rounded-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className='text-lg font-bold text-gray-600'>{user.name}</p>
                        <p className='text-sm text-gray-600 font-bold'>{user.email}</p>
                    </div>
                </div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <p className='text-base text-gray-500 font-medium'>Total Quiz ({myLibrary.length})</p>
                    </div>
                    <div>
                        <p className='text-base text-gray-500 font-medium'>Playes (0)</p>
                    </div>
                    <div>
                        <p className='text-base text-gray-500 font-medium'>Players (0)</p>
                    </div>
                </div>
            </div>
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
        </div>
    )
}
