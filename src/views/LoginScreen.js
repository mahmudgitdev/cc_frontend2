import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader'
import api from '../api/api';
import ClipLoader from "react-spinners/ClipLoader";

export default function LoginScreen() {
    const navigate = useNavigate();
    const [error,setError] = useState("");
    const [isShowError,setisShowError] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const handleFocus = ()=>{
        setisShowError(false);
        setError("");
    }
    const loginAccount = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        await api.post('/auth/user/login',{
            email: e.target.email.value,
            password: e.target.password.value
        }).then((res)=>{
            if(res.data.error){
                setError(res.data.error);
                setisShowError(true);
                setIsLoading(false);
            }else{
                setIsLoading(true);
                localStorage.setItem("token",res.data.token);
                navigate("/");
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className='bg-gray-50 min-h-screen'>
            <AuthHeader />

            <div className='max-w-sm md:max-w-md lg:max-w-xl mx-auto bg-white border'>
                
                <div className='flex justify-center text-center py-10'>
                    <h1 className='text-xl text-gray-900 font-bold'>Login Account</h1>
                </div>
                <div className='flex justify-center text-center py-2'>
                    {isShowError?(
                        <>
                          <p className='text-red-500'>{error}</p>
                        </>
                    ):(
                        <>
                        </>
                    )}
                </div>
                <form onSubmit={loginAccount}>
                <div className='flex flex-col gap-3 px-10'>
                    <div>
                    <label>Email</label>
                    <input onFocus={handleFocus} name='email' className='border w-full p-3 focus:outline-none rounded' type="email" placeholder='Email' required />
                    </div>
                    <div>
                    <label>Password</label>
                    <input onFocus={handleFocus} name='password' autoComplete="on" className='border w-full p-3 focus:outline-none rounded' type="password" placeholder='Password' required />
                    </div>
                    
                    {isLoading?(
                        <>
                        <div className='relative'>
                        <button disabled className="bg-blue-800 w-full text-white font-bold p-2 rounded" type="button">Verifying...</button>
                        <div className="absolute top-1.5 left-20"><ClipLoader loading={isLoading} color={"#ffff"} size={28} /></div>
                        </div>
                        </>
                    ):(
                        <button className='bg-blue-900 text-white rounded focus:outline-none p-2'>Login Account</button>
                    )}
                </div>
                </form>
                <div className='flex flex-row gap-2 justify-between items-center py-3 px-10'>
                    <div className='border border-gray-200 w-full'></div>
                    <p className='text-sm font-bold text-gray-800'>OR</p>
                    <div className='border border-gray-200 w-full'></div>
                </div>
                <div className='flex flex-col gap-4 px-10'>
                    <button className='bg-red-600 text-white rounded focus:outline-none p-2'>Login With Google</button>
                    <button className='bg-blue-600 text-white rounded focus:outline-none p-2'>Login With Facebook</button>
                    <button className='bg-blue-300 text-white rounded focus:outline-none p-2'>Login With Linked in</button>
                </div>
                <div className='flex justify-center text-center py-5'>
                  Don't have an account? <Link className='text-blue-500' to="/auth/register">&nbsp;Sign up</Link>
                </div>
            </div>
        </div>
    )
}
