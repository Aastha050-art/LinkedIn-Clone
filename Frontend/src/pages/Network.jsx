import React, { useContext, useEffect,useState } from 'react'
import Nav from '../component/nav'
import axios from 'axios'
import pfofile from '../assets/pfofile.webp'
import { authDataContext } from '../context/Authcontext'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";




function Network() {
  let {serverUrl}=useContext(authDataContext)
  let[connections,setConnections]=useState([])
  const handleGetRequests=async ()=>{
    try{
    let result = await axios.get(`${serverUrl}/api/connection/requests`,{withCredentials:true})
    setConnections(result.data)
  }catch(error){
    console.log(error)
  }
}
  const handleAcceptConnection = async (requestId) => {
    try {
      let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, { withCredentials: true })
   setConnections(connections.filter((con)=>con._id !==requestId))
    
       
      
  
    } catch (error) {
      console.log(error)
    }
  }
    const handleRejectConnection = async (requestId) => {
    try {
      let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, { withCredentials: true })
       setConnections(connections.filter((con)=>con._id !==requestId))
       
     
    } catch (error) {
      console.log(error)
    }
  }



useEffect(()=>{
handleGetRequests()
},[])
  return (
    <div className='w-screen h-[100vh]  bg-[#f3f2ec] pt-[100px] flex flex-col items-center gap-[40px] '>
      <Nav/>
      <div className='w-full h-[100px] bg-[white] shadow-lg rounded-lg  flex items-center p-[10px] text-[22px] text-gray-600 '>
           Invitation {connections.length}
      </div>
      {connections.length>0 &&  <div className='w-[100%] max-w-[900px]  shadow-lg rounded-lg flex flex-col bg-white gap-[20px] min-h-[100px]'>
        {connections.map((connection,index)=>(
         <div className=' w-full min-h-[100px] flex justify-between items-center p-[20px]'>
          <div className='flex justify-center items-center gap-[10px] '>
           <div className=' px-1 overflow-hidden cursor-pointer'>
                 <img src={connection.sender.profileImage||pfofile} alt='dp' className=' w-[60px] h-[60px] rounded-full' />
                </div>
             <div className='font-semibold text-gray-700 text-[19px]'>{`${connection.sender.firstName} ${connection.sender.lastName}`}</div>

                </div>
                <div className='flex justify-center items-center gap-[10px]'>
             <button className='text-[#0080ff] font-semibold'><IoIosCheckmarkCircleOutline className='w-[40px] h-[40px]'
              onClick={()=>{
              handleAcceptConnection(connection._id)
             }} /></button>
             <button  className='text-[rgb(238,47,47)] font-semibold'><RxCrossCircled className='w-[37px] h-[37px]' onClick={()=>{
              handleRejectConnection(connection._id)
             }}/></button>
                </div>
         </div> 
        ))}
      </div> }
  
    </div>
  )
}

export default Network
