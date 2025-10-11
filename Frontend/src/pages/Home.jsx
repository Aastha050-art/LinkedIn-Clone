import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../component/nav'
import pfofile from '../assets/pfofile.webp'
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userContextData } from '../context/UserContext';
import { HiPencil } from "react-icons/hi";
import EditProfile from '../component/EditProfile';
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from 'axios';
import { authDataContext } from '../context/Authcontext';
import { useSearchParams } from 'react-router-dom';
import Post from '../component/Post';

function Home() {
  let { userData, setUserData, edit, setEdit ,postData,setPostdata, handleGetUserProfile} = useContext(userContextData)
  let [frontendImage,setFrontendImage]=useState("")
  let [backendImage, setBackendImage]=useState("")
  let[posting,setPosting]=useState(false)
  let[suggestedData,setSuggestedData]=useState([])


  let [description, setDescription]=useState("")
  let image=useRef()
  let[uploadPost,setuploadPost]=useState(false)

  let{serverUrl}=useContext(authDataContext)

  function handleImage(e){
   let file= e.target.files[0]
   setBackendImage(file)
   setFrontendImage(URL.createObjectURL(file))
  }

   async  function handleUploadPost(){
    try{
      setPosting(true)
    let formData=new FormData()
    formData.append("description",description)
   
    if(backendImage){
      formData.append("image",backendImage)
    }
    let result= await axios.post(serverUrl+"/api/post/create",formData,{withCredentials:true})
    setPosting(false)
    setuploadPost(false)
    
    const neWPost= result.data;
    setPostdata(prev=>[neWPost,...prev])
   
  }catch(error){
    console.log(error.message)
    setPosting(false)
  }
  }
   async function handleGetSuggestedUser(){
    try{
    let result = await axios.get(serverUrl+"/api/user/suggesteduser",{withCredentials:true})

    setSuggestedData(result.data)
     
    }catch(error){
 console.log(error,error.message)
    }
   }


useEffect(()=>{
  handleGetSuggestedUser()
 
},[])

  return (
    <div className='w-full min-h-[100vh] bg-[#f3f2ec] pt-[100px] px-[20px] flex items-center lg:items-start justify-center 
    gap-[20px] flex-col lg:flex-row relative pb-[50px]'>
      {edit && <EditProfile />}

      <Nav />

      {/*1st div */} <div className='lg:w-[25%] w-full min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative'>

       

        <div className='w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center 
        justify-center cursor-pointer' onClick={() => setEdit(true)}>

          <img src={userData.coverImage} alt='cover' className='w-full' />
          <div className='w-[25px] h-[25px] text-[white] absolute right-[25px] top-[20px] '>
            <FiCamera className='w-[25px] h-[25px]' />
          </div>
        </div>
        <div className='  w-[70px] h-[70px] rounded-full flex overflow-hidden  items-center justify-center
           absolute top-[65px] left-[35px] cursor-pointer' onClick={() => setEdit(true)}>
          <img src={userData.profileImage || pfofile} alt='dp' className='h-full w-full  ' />

        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff]  absolute top-[105px] left-[90px] rounded-full flex items-center
           text-white justify-center cursor-pointer'>
          <FiPlus />
        </div>
        <div className='mt-[30px] pl-[20px]  '>
          <div className='text-gray-700 font-semibold text-[22px] ' >{`${userData.firstName} ${userData.lastName} `}</div>
          <div className='text-gray-500  font-semibold text-[18px] '>{userData.headline || ""}</div>
          <div className='text-gray-500  font-semibold text-[16px] '>{userData.location}</div>
        </div>
        <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff]
             text-[#2dc0ff] mt-[20px] my-[20px] flex items-center justify-center gap-[5px]'
          onClick={() => setEdit(true)}>Edit Profile <HiPencil /> </button>
      </div>
        {uploadPost&& <div className='w-full h-full bg-black fixed z-[100] top-0 opacity-[0.6] left-0'></div>}

        {uploadPost&&  <div className=' w-[90%] max-w-[450px] h-[500px] bg-white shadow-lg rounded-lg fixed z-[200] flex flex-col
        justify-start items-start gap-[20px] p-[20px] top-[100px] '>
          <div className='absolute top-[20px] right-[20px] cursor-pointer '>
            <RxCross1 className='w-[25px] h-[25px]
             text-gray-800 font-bold cursor-pointer'onClick={()=>setuploadPost(false)} /></div>
             <div className=' flex justify-start iteam-centre gap-[10px]'>
              
             <div className='  w-[70px] h-[70px] rounded-full flex overflow-hidden  items-center justify-center
            top-[65px] left-[35px] cursor-pointer'>
            <img src={userData.profileImage || pfofile} alt='dp' className='h-full w-full  ' />
            </div>
             <div className=' text-[22px] ' >{`${userData.firstName} ${userData.lastName} `}</div>
            </div>

           <textarea className={`${frontendImage?"h-[200px]":"h-[550px]"} w-full border-none outline-none p-[10px] text-[18px] resize-none` }
           placeholder='What do you want to talk about ?' value={description} onChange={(e)=>setDescription(e.target.value)}> </textarea>
           <div className='w-full h-[300px] overflow-hidden flex justify-center items-center'>
            <img src={frontendImage || ""} alt='' className='h-full  rounded-lg'/>
           </div>
           <div className='w-full h-[200px] flex flex-col '>
            <div className='p-[20px] flex justify-start items-center border-b-2 border-gray-800'>
               <BsImage className='w-[24px] h-[24px] text-gray-500 'onClick={()=>image.current.click()} />
               <input type='file' ref={image} hidden onChange={handleImage}/>
            </div>
            <div className='flex iteam-center justify-end' >   
              <button className='w-[100px] h-[50px] rounded-full bg-[#1dc9fd] mt-[30px] text-white '
               onClick={()=>handleUploadPost()} disabled={posting}>{posting?"Posting...":"Post"}</button>           
            </div>

           </div>
        </div>}
       

      {/*2nd div */} <div className='lg:w-[50%] w-full min-h-[200px] bg-[#f3f2ec] shadow-lg flex flex-col gap-[20px] '>
        <div className='w-full h-[120px] bg-[white] rounded-lg shadow-lg flex justify-center items-center gap-[10px] p-[20px] '>
          <div className='  w-[70px] h-[70px] rounded-full flex overflow-hidden  items-center justify-center
            top-[65px] left-[35px] cursor-pointer' >
            <img src={userData.profileImage || pfofile} alt='dp' className='h-full w-full  ' />

          </div>
          <button className='w-[80%] h-[60px] border-2 border-gray-500  rounded-full flex justify-start 
          items-center px-[20px] hover:bg-gray-200 ' onClick={()=>setuploadPost(true)}>Start a Post</button>
        </div>
        {postData.map((post,index)=>(
         <Post key={index} id={post._id} description={post.description} author={post.author} 
         image={post.image} like={post.like} comment={post.comment}  createdAt={post.createdAt}/> 
        ))}
       

      </div>

      {/*3rd div */} <div className='lg:w-[25%] w-full min-h-[200px] bg-[white] shadow-lg hidden lg:flex flex-col p-[20px]'>
      <h1 className='text-[20px] text-gray-600 font-semibold ml-[5px]'>Suggested Users</h1>
      {suggestedData.length>0 && <div className=' flex flex-col gap-[10px]'>
       {suggestedData.map((user)=>(
        <div className='flex items-center gap-[10px] mt-[10px] cursor-pointer rounded-lg p-[5px] hover:bg-gray-300' onClick={()=>handleGetUserProfile(user.userName)}>
              <div className=' px-1 overflow-hidden  '>
                 <img src={user.profileImage|| pfofile } alt='dp' className=' w-[40px] h-[40px] rounded-full' />
                 </div>
                 <div>
                  <div className='text-gray-700 font-semibold text-[20px] ' >{`${user.firstName} ${user.lastName} `}</div>
                    <div className='text-gray-500  font-bold text-[12px] '>{`${user.headline}` || ""}</div></div>
        </div>
       ))}
       
        </div>} 
        {suggestedData.length==0 && <div>
        No Suggested Users  
          </div>}
      </div>
    </div>
  )
}

export default Home
