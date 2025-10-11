import React, { useEffect, useState } from 'react'
import logo2 from '../assets/logo2.png'
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import pfofile from '../assets/pfofile.webp'
import { useContext } from 'react';
import { userContextData } from '../context/UserContext';
import { authDataContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Nav() {
  let[activeSearch, setActiveSearch]=useState(false)
  let[showPopup,setShowPopup]=useState(false)
  let {userData, setUserData, handleGetUserProfile}=useContext(userContextData)
  let {serverUrl}=useContext(authDataContext)
  let [searchInput,setSearchInput]=useState()
  let[searchData,setSearchData]=useState([])
  let navigate=useNavigate()
  const handleSignOut=async ()=>{
     try{
     let result= await axios.get(serverUrl+"/api/auth/logout",{withCredentials:true})
    
     setUserData(null)
     navigate("/login")
     }catch(error){
      console.log(error)
     }
  }
  const handleSearch=async ()=>{
     try{
     let result= await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
   
     setSearchData(result.data)
    
     }catch(error){
      setSearchData([])
      console.log(error)
     }
  }
  useEffect(()=>{

    handleSearch()
   
  },[searchInput])
  return (
  <div className='w-full h-[80px] bg-[white] fixed top-0 shadow-lg flex md:justify-around justify-between items-center px-[10px] left-0 z-[50] ' >
    <div className=' flex justify-centre items-center gap-[10px] ' >

       <div onClick={()=>{setActiveSearch(false)
        navigate("/")
       }}><img src={logo2} alt='logo' className='w-[50px]'/></div> 


       {!activeSearch&&
        <div><IoSearchSharp className=' w-[23px] h-[23px] bg-[#f3f2ec] outline-none lg:hidden' onClick={()=>setActiveSearch(true)}/></div>}
       {searchData.length>0 &&  <div className=' absolute top-[90px] h-[500px] left-[0px] lg:left-[20px] shadow-lg 
         w-[100%] lg:w-[700px] bg-white z-50  flex flex-col gap-[20px] p-[20px] overflow-auto'>
        {searchData.map((search)=>(
         <div className=' flex gap-[20px] items-center border-b-2 border-gray-300 p-[10px] hover:bg-gray-200 rounded-lg cursor-pointer'onClick={()=>{
          handleGetUserProfile(search.userName)
         }}>
             <div className=' px-1 overflow-hidden '>
       <img src={search.profileImage|| pfofile } alt='dp' className=' w-[70px] h-[70px] rounded-full' />
       </div>
       <div>
        <div className='text-gray-700 font-semibold text-[22px] ' >{`${search.firstName} ${search.lastName} `}</div>
          <div className='text-gray-500  font-semibold text-[18px] '>{`${search.headline}` || ""}</div></div>
         </div> 
        ))}
             </div>  }

       



       <form className={`md:w-[300px] w-[190px] h-[40px] bg-[#eeece2] lg:flex justify-center items-center gap-[10px] px-[10px] py-[5px] rounded-md
         ${!activeSearch?"hidden":"flex"}`}>
       <div><IoSearchSharp className=' w-[23px] h-[23px] bg-[#f3f2ec] outline-none'/></div>
       <input type='text' placeholder='Search Users...' className='w-[80%] h-full bg-transparent outline-none '
        onChange={(e)=>setSearchInput(e.target.value)} value={searchInput}/>
       </form>

    </div>
    <div className='flex justify-centre items-center gap-[20px] relative'>
      {showPopup&& <div className='w-[290px] min-h-[300px]  bg-white shadow-lg rounded-lg
       absolute  top-[75px] flex flex-col items-center gap-[20px] p-[20px] z-[100px] right-[20px] lg:right-[40px]'>

         <div className=' px-1 overflow-hidden '>
       <img src={userData.profileImage|| pfofile } alt='dp' className=' w-[70px] h-[70px] rounded-full' />
       </div>
       <div className='font-semibold text-gray-700 text-[19px]'>{`${userData.firstName} ${userData.lastName}`}</div>
       <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>handleGetUserProfile(userData.userName)}>View Profile</button>
       <div className='w-full h-[1px] text-gray-700'></div>
        <div className='  flex  w-full items-center justify-start text-gray-600 gap-[10px]'>
        <FaUserGroup className='w-[23px] h-[23px] text-gray-600 '  onClick={()=>navigate("/network")} />
        <div>My Network</div>
        </div>
        <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ef0c0c] text-[#ef0c0c] ' onClick={()=>{handleSignOut()}}>Sign Out</button>

       </div>
}
     




      <div className=' lg:flex flex-col items-center justify-center text-gray-600 hidden' >
        <TiHome className='w-[23px] h-[23px] text-gray-600 ' onClick={()=> navigate("/")}/>
        <div>Home</div>
      </div>

      <div className=' lg:flex flex-col items-center justify-center text-gray-600 hidden' onClick={()=>navigate("/network")}>
        <FaUserGroup className='w-[23px] h-[23px] text-gray-600 ' />
        <div>My Network</div>
      </div>

      <div className=' lg:flex flex-col items-center justify-center text-gray-600  md:flex cursor-pointer'onClick={()=>navigate("/notification")}>
        <IoIosNotifications className=' w-[23px] h-[23px] text-gray-600  '  />
        <div className='md:block hidden'>Notification</div>
      </div>

      <div className=' px-1 overflow-hidden cursor-pointer'onClick={()=>setShowPopup(prev=>!prev)}>
       <img src={userData.profileImage||pfofile} alt='dp' className=' w-[50px] h-[50px] rounded-full' />
      </div>
    </div>
    
  </div>
    
    

  )
}

export default Nav
