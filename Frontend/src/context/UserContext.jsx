import React, { useState,useEffect } from 'react'
import { createContext } from 'react'
export const userContextData=createContext()
import { useContext } from 'react' 
import { authDataContext } from './Authcontext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { io } from "socket.io-client"

export let socket=io("https://backend-xnps.onrender.com")

function UserContext({children}) {
  let navigate=useNavigate()
  let [userData,setUserData]=useState(null)
let {serverUrl}=useContext(authDataContext)
let [edit,setEdit]=useState(false)
  let[postData,setPostdata]=useState([] )
  let [profileData,setProfileData]=useState([])

const getCurrentUserData = async ()=>{
  try{
     let result = await axios.get(serverUrl+"/api/user/currentuser",{withCredentials:true})
   
     setUserData(result.data)
  }catch(error){
    setUserData(null)
    }

}

const getPost=async ()=>{
  try{
    let result = await axios.get(serverUrl+"/api/post/getpost",{
      withCredentials:true}
    )
   

    setPostdata(result.data)
  }catch(error){
     console.log(error.message)
  }
}
 const handleGetUserProfile=async(userName)=>{
  try{
        let result = await axios.get(serverUrl+`/api/user/profile/${userName}`,{
      withCredentials:true})

      setProfileData(result.data)
     
      navigate("/profile")
  }catch(error){
   console.log(error)
  }
 }

  useEffect(()=>{
 getCurrentUserData()
 getPost()
   } ,[])
   
   let value={
  serverUrl,
  userData,setUserData,
  edit,setEdit,
  postData,setPostdata,
  getPost,
  handleGetUserProfile,
  profileData,setProfileData

}
  return (
    <div>
      <userContextData.Provider value={value}>
          {children} 
      </userContextData.Provider>
     
    </div>
  )
}

export default UserContext
