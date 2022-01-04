import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"
export default function Header(props) {
    const navigate = useNavigate();
    const [isShow,setIsShow] = useState(false);

    const logout = ()=>{
        localStorage.removeItem("token");
        navigate('/auth/login');
    }

    const navigateCreate = ()=>{
        navigate('/create');
    }
    return (
        <nav className="bg-white shadow-md px-6 py-2">
                <div className="w-full mx-auto">
                    <div className="flex items-center justify-center lg:justify-between relative">
                        <Link to="/">
                            {/* <img className="w-full"  src={logo} alt="logo" /> */}
                            {/* <h1 className='text-blue-700 font-bold'>Champion Challenge</h1> */}
                        </Link>
                        <div className="flex flex-row items-center justify-between">
                            <Link to="/" className="flex flex-row items-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>          
                            <span className="font-medium text-gray-800">Home</span>
                            </Link>
                            <motion.button 
                            whileHover={{ scale: 1.05 }}
                            onClick={navigateCreate} className="w-24 p-2 bg-gray-700 mr-4 text-white rounded font-bold">
                                Create
                            </motion.button>
                            <button onClick={()=>setIsShow(!isShow)} className='w-8 h-8 rounded-full bg-gray-700 border cursor-pointer flex justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </button>
                        </div>
                    </div>
                        {isShow?(
                        <div className='w-60 h-auto bg-white rounded border-2 border-gray-200 absolute right-6'>
                            <div className='flex flex-row justify-between text-center items-center px-3 py-1'>
                                <p className='text-lg text-gray-700 font-bold'>{props.user.name}</p>
                                {/* <Link className='text-sm text-gray-500' to="/profile">View profile</Link> */}
                            </div>
                            <div className='flex flex-col gap-3 px-3 py-1'>
                            <Link to="/settings" className='flex items-center gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                                <p className='text-sm text-gray-700 font-medium'>Change Language</p>
                            </Link>
                            <Link to="/settings" className='flex items-center gap-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className='text-sm text-gray-700 font-medium'>Settings</p>
                            </Link>
                            <Link to="/settings" className='flex items-center gap-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className='text-sm text-gray-700 font-medium'>Subscriptions</p>
                            </Link>
                            <Link to="/settings" className='flex items-center gap-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                </svg>
                                <p className='text-sm text-gray-700 font-medium'>Resources</p>
                            </Link>
                            </div>
                            <div className='border'></div>
                            <div onClick={logout} className='flex items-center px-3 pb-4 py-1 cursor-pointer gap-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <p className='text-sm text-red-600 font-medium'>Log out</p>
                            </div>
                        </div>
                        ):(<></>)}

                </div>

               

        </nav>
    )
}
