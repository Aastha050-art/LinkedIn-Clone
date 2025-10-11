import React from 'react'
import Nav from '../component/nav'
import axios from 'axios'
import { RxCross1 } from "react-icons/rx";
import { useContext ,useState,useEffect } from 'react'
import { userContextData } from '../context/UserContext'
import pfofile from '../assets/pfofile.webp'
import { authDataContext } from '../context/Authcontext'

function Notification() {
    let{serverUrl}=useContext(authDataContext)
    let[notificationData,setNotificationData]=useState([])


     async function handleGetNotification(){
    try{
    let result = await axios.get(serverUrl+"/api/notification/get",{withCredentials:true})
    
    setNotificationData(result.data)
     
    }catch(error){
 console.log(error,error.message)
    }
   }
      async function handleDeleteNotification(id){
    try{
    let result = await axios.delete(`${serverUrl}/api/notification/deleteone/${id}`,{withCredentials:true})

    await handleGetNotification()
     
    }catch(error){
 console.log(error,error.message)
    }
   }
      async function handleDeleteAlltNotification(){
    try{
    let result = await axios.delete(serverUrl+"/api/notification/",{withCredentials:true})

     await handleGetNotification()
     
    }catch(error){
 console.log(error,error.message)
    }
   }

   function handleMessage(type){
    try{
     if(type=="like"){
        return "liked your post "
     }else if(type=="comment"){
         return "commented on  your post "
     }else{
         return "Accept your request "
     }
    }catch(error){

    }
   }


   useEffect(()=>{
     handleGetNotification()
   },[])
  return (
    <div className='w-screen h-[100vh]  bg-[#f3f2ec] pt-[100px] flex flex-col items-center gap-[40px] '>
      <Nav/>
     <div className='w-full h-[100px] bg-[white] shadow-lg rounded-lg  flex items-center p-[10px] text-[22px] text-gray-600 justify-between '>

      <div>
          Notifications: {notificationData.length}
       </div>
          {notificationData.length >0 && <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#ef0c0c] text-[#ef0c0c] '
           onClick={()=>{handleDeleteAlltNotification()}}>Clear All</button> }
         
      
      </div> 
      {notificationData.length>0 &&  <div className='w-[100%] max-w-[900px]  shadow-lg rounded-lg flex flex-col bg-white gap-[20px]
       h-[100vh] overflow-auto p-[20px]'>
             {notificationData.map((noti,index)=>(
              <div className=' w-full min-h-[100px] flex justify-between items-center p-[20px] border-b-2 border-gray-200' key={index}>
               <div>
               <div className='flex justify-center items-center gap-[10px] '>
                <div className=' px-1 overflow-hidden cursor-pointer'>
                      <img src={noti.relatedUser.profileImage||pfofile} alt='dp' className=' w-[60px] h-[60px] rounded-full' />
                     </div>
                  <div className='font-semibold text-gray-700 text-[19px]'>{`${noti.relatedUser.firstName} ${noti.relatedUser.lastName}
                   ${handleMessage(noti.type)}`}</div>


              </div>
              {noti.relatedPost && 
                <div className='flex items-center gap-[10px] ml-[80px] h-[70px] overflow-hidden  '>
                  <div className='w-[80px] h-[50px] overflow-hidden'>
                    <img src={noti.relatedPost.image} alt=""/>
                    </div>
                </div>
              }
              </div>
              <div className='flex justify-center items-center gap-[10px]'>
                  <RxCross1 className='w-[20px] h-[20px]
                           text-gray-800 font-bold cursor-pointer' onClick={()=>handleDeleteNotification(noti._id)}/>
              </div>
              </div> 
             ))}
           </div> }
    </div>
  )
}

export default Notification
