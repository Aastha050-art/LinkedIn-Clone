import React, { useContext,useState, useEffect } from 'react'
import { authDataContext } from '../context/Authcontext'
import io from 'socket.io-client'
import { userContextData } from '../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const socket = io("http://localhost:8000")
function ConnectionButton({ userId }) {
  let navigate=useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData } = useContext(userContextData)
  let [status, setStatus] = useState("")
  const handleSendConnection = async () => {
    try {
      let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, { withCredentials: true })
     
    } catch (error) {
      console.log(error)
    }
  }

 
  const handleGetStatus = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`, { withCredentials: true })
      setStatus(result.data.status)
     
       
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveConnection = async () => {
    try {
      let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, { withCredentials: true })
    
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket.emit("register", userData._id)
    handleGetStatus()
  
  socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {

    if(updatedUserId==userId) {
          setStatus(newStatus)
      }

  })
  return () => {
    socket.off("statusUpdate")
  }
   }, [userId])

   const handleClick=async()=>{
    if(status=="disconnect"){
      await handleRemoveConnection()
    }else if(status=="received"){
      navigate("/network")
    }else{
      await handleSendConnection()
    }
   }

  return (
    <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff]
                 text-[#2dc0ff] mt-[20px] my-[20px] flex items-center justify-center gap-[5px]' disabled={status==="pending"}
      onClick={handleClick}>{status}  </button>
  )
}

export default ConnectionButton
