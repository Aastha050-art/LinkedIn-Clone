import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import {userContextData} from './context/UserContext'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'

function App() {
  let {userData}=useContext(userContextData)
 
  return (
  <Routes>
    <Route path='/'element={ userData?<Home/>:<SignUp/>}/>
     <Route path='/signup'element={userData?<Navigate to ='/'/>:<SignUp/>}/>
      <Route path='/login'element={userData?<Navigate to ='/'/>:<Login/>}/> 
      <Route path='/network'element={userData?<Network/>:<Navigate to ='/'/>}/> 
       <Route path='/profile'element={userData?<Profile/>:<Navigate to ='/'/>}/> 
       <Route path='/notification'element={userData?<Notification/>:<Navigate to ='/'/>}/> 
      
  </Routes>
  )
}

export default App

       
