import React from 'react'
import { Link } from 'react-router-dom'

export default function CreatorHeader() {
    return (
        <nav className="bg-white shadow-md px-6 py-2">
        <div className="w-full mx-auto">
            <div className="flex items-center justify-center lg:justify-between relative">
                <Link to="/">
                    {/* <img className="w-full"  src={logo} alt="logo" /> */}
                    {/* <h1 className='text-blue-700 font-bold'>Champion Challenge</h1> */}
                </Link>
                <div className="hidden lg:flex flex-row items-center justify-between">
                    <button className="w-16 p-2 bg-gray-200 mr-4 shadow-md text-gray-600 rounded font-bold">
                        Exit
                    </button>
                    <button className="w-24 p-2 bg-gray-700 mr-4 shadow-md text-white rounded font-bold">
                        Save
                    </button>
                </div>
            </div>
            
        </div>
</nav>
    )
}
