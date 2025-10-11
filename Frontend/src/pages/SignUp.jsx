import React from 'react'
import logo from "../assets/logo.svg"
import { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { useContext } from 'react'
import { authDataContext } from '../context/Authcontext'
import axios from "axios"
import { userContextData } from '../context/UserContext'



function SignUp() {
   let [firstName,setFirstName]=useState("")
   let [lastName,setLastName]=useState("")
   let [userName,setUserName]=useState("")
   let [email,setEmail]=useState("")
   let [password,setPassword]=useState("")
   let [show,setShow]=useState(false)
   let[loading,setLoading]=useState(false)
   let[error,setError]=useState("")
   let {serverUrl}=useContext(authDataContext)
   let {setUserData}=useContext(userContextData)
   let navigate=useNavigate()
   const handleSignup=async (e)=>{
    e.preventDefault()
    setLoading(true)
  try{
    let result = await axios.post(serverUrl+"/api/auth/signup",{
      firstName,
      lastName,
      userName,
      email,
      password,
      
    },{withCredentials:true})
    
    navigate("/")
    setUserData(result.data)
    setError("")
    setLoading(false)
    setFirstName("")
    setLastName("")
    setUserName("")
    setEmail("")
    setPassword("")
  }catch(error){
   console.log(error)
   setLoading(false)
   setError(error.response.data.message)
  }
}
  return (
  
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
     <div className='p-[30px] lg:p-[35px] w-full items-center'>
        <img src={logo} alt='logo'/>
     </div>
      <form className='w-[90%] max-w-[400px] h-[530px] md:shadow-xl flex flex-col justify-center
       gap-[10px] p-[15px] ' onSubmit={handleSignup}>
        <h1 className='text-gray-800 text-[30px] font-semibold '>Sign Up</h1>
        <input type="text" placeholder='firstname' required className='w-[100%] h-[50px] border-2 border-gray-600 rounded-md 
        text-gray-800 text-[18px]  px-[20px] py-[10px]  ' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
        <input type="text" placeholder='lastname' required className='w-[100%] h-[50px] border-2 border-gray-600 rounded-md 
        text-gray-800 text-[18px]  px-[20px] py-[10px]  ' value={lastName} onChange={(e)=>setLastName(e.target.value)}  />
        <input type="text" placeholder='username' required className='w-[100%] h-[50px] border-2 border-gray-600 rounded-md 
        text-gray-800 text-[18px]  px-[20px] py-[10px]  'value={userName}  onChange={(e)=>setUserName(e.target.value)}/>
        <input type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 rounded-md 
        text-gray-800 text-[18px]  px-[20px] py-[10px] 'value={email}   onChange={(e)=>setEmail(e.target.value)}/>
        <div className='w-[100%] h-[50px] border-2 border-gray-600 rounded-md 
        text-gray-800  relative '> 
          <input type={show?"text":"password"} placeholder='password' required className='w-full h-full  
        text-gray-800 text-[18px]  px-[20px] py-[10px]  'value={password} onChange={(e)=>setPassword(e.target.value)}/> 
        <span className='absolute right-[20px] top-[10px] font-semibold text-[#1dc9fd] cursor-pointer '
        onClick={()=>setShow(prev=>!prev)}>{show?"hidden":"show"}</span></div>
        {error && <p className='text-center text-red-500'>*{error}</p>}
      
        <button className='w-[100%] h-[50px] rounded-full bg-[#1dc9fd] mt-[30px] text-white 'disabled={loading}>{loading?"Loading...":"Sign Up"}</button>
        <p className='text-center cursor-pointer ' onClick={()=>navigate("/login")}>Already have an account? <span className='text-[#24b2ff]'>Sign In</span></p>

      </form>
    </div>
  )
}

export default SignUp
