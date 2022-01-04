import React from 'react';
import { Link } from 'react-router-dom';
export default function AuthHeader() {
    return (
        <nav className="bg-white shadow-md p-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-center lg:justify-between">
                        <Link to="/">
                            {/* <img className="w-full"  src={logo} alt="logo" /> */}
                            <h1 className='text-blue-700 font-bold'>Champion Challenge</h1>
                        </Link>
                        <div className="hidden lg:flex flex-row items-center justify-between">
                            <Link to="/" className="flex flex-row items-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>          
                            <span className="font-medium text-blue-600">Home</span>
                            </Link>



                        </div>
                    </div>

                </div>

               

        </nav>
    )
}
