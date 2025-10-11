import React, { useContext, useEffect,useState } from 'react'
import Nav from '../component/nav'
import pfofile from '../assets/pfofile.webp'
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userContextData } from '../context/UserContext';
import { HiPencil } from "react-icons/hi";
import { authDataContext } from '../context/Authcontext';
import axios from 'axios';
import EditProfile from '../component/EditProfile';
import Post from '../component/Post';
import ConnectionButton from '../component/ConnectionButton';


function Profile() {
   let { userData, setUserData, edit, setEdit ,postData,setPostdata, profileData,setProfileData
} = useContext(userContextData)
    let {serverUrl}=useContext(authDataContext)
 
   let[profilePost,setProfilePost]=useState([])
   

   useEffect(()=>{
    setProfilePost(postData.filter((post)=>post.author._id==profileData._id))
   },[profileData])


  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px] '>
      <Nav/>
   { edit&&<EditProfile/>}  
      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]'>
        <div className='relative bg-white pb-[40px] rounded-lg shadow-lg'>
           <div className='w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center 
                  justify-center cursor-pointer' onClick={() => setEdit(true)}>
          
                    <img src={profileData.coverImage} alt='cover' className='w-full' />
                    <div className='w-[25px] h-[25px] text-[white] absolute right-[25px] top-[20px] '>
                      <FiCamera className='w-[25px] h-[25px]' />
                    </div>
                  </div>
                  <div className='  w-[70px] h-[70px] rounded-full flex overflow-hidden  items-center justify-center
                     absolute top-[65px] left-[35px] cursor-pointer' onClick={() => setEdit(true)}>
                    <img src={profileData.profileImage || pfofile} alt='dp' className='h-full w-full  ' />
          
                  </div>
                  <div className='w-[20px] h-[20px] bg-[#17c1ff]  absolute top-[105px] left-[90px] rounded-full flex items-center
                     text-white justify-center cursor-pointer'>
                    <FiPlus />
                  </div>
                  <div className='mt-[30px] pl-[20px]  '>
                    <div className='text-gray-700 font-semibold text-[22px] ' >{`${profileData.firstName} ${profileData.lastName} `}</div>
                    <div className='text-gray-700  font-semibold text-[18px] '>{profileData.headline || ""}</div>
                     <div className='text-gray-700  font-semibold text-[18px] '>{profileData.location || ""}</div>
                    <div className='text-gray-700  font-semibold text-[18px] '>{profileData.connection.length} connection</div>
                  </div>
                  {profileData._id==userData._id &&  <button className='min-w-[150px] h-[40px] ml-[20px] rounded-full border-2 border-[#2dc0ff]
                       text-[#2dc0ff] mt-[20px] my-[20px] flex items-center justify-center gap-[5px]'
                    onClick={() => setEdit(true)}>Edit Profile <HiPencil /> </button>}

                    {profileData._id!==userData._id && <div className='ml-[20px] mt-[20px] '><ConnectionButton userId={profileData._id}/></div>}
                 
                 </div>
                 <div className='w-full h-[100] flex items-center  p-[20px] bg-white  text-[22px]
                  text-gray-600 font-semibold'>{`Post (${profilePost.length}) `}</div>

                  {profilePost.map((post,index)=>(
                    <Post key={index} id={post._id} description={post.description} author={post.author} 
                   image={post.image} like={post.like} comment={post.comment}  createdAt={post.createdAt} />
                  ))}
                  {profileData.skills.length>0 &&  <div className='w-full min-h-[100px] flex flex-col justify-center   p-[20px] bg-white  text-[22px]
                  text-gray-600 font-semibold shadow-lg rounded-lg'>
                    <div  className='text-[22px] text-gray-600'>Skills</div>
                    <div className='flex justify-center items-center gap-[20px] p-[20px] text-gray-600'>
                   {profileData.skills.map((skill)=>(
                    <div>{skill}</div>
                   ))}
                   {profileData._id==userData._id &&  <button className='min-w-[150px] h-[40px] ml-[20px] rounded-full border-2 border-[#2dc0ff]
                       text-[#2dc0ff] mt-[20px]  flex items-center justify-center gap-[10px]'
                        onClick={()=>setEdit(true)}>Add Skills</button>}
                   
                   </div>
                     </div>  }

                  {profileData.education.length>0 &&  <div className='w-full min-h-[100px] flex flex-col justify-center   p-[20px] bg-white  text-[22px]
                  text-gray-600 font-semibold shadow-lg rounded-lg'>
                    <div  className='text-[22px] text-gray-600'>Education</div>
                    <div className='flex  flex-col justify-start items-start gap-[20px] p-[20px] text-gray-600'>
                   {profileData.education.map((edu)=>(
                    <>
                    <div>College: {edu.college}</div>
                     <div>Degree: {edu.degree}</div>
                    <div>Field Of Study: {edu.fieldOfStudy}</div>
                    </>
                   ))}
                   {profileData._id==userData._id &&   <button className='min-w-[200px] h-[40px]  rounded-full border-2 border-[#2dc0ff]
                       text-[#2dc0ff] mt-[20px]  flex items-center justify-center gap-[10px]'
                        onClick={()=>setEdit(true)}>Add Education</button>  }
                 
                   </div>
                     </div>  }
                  
                   {profileData.experience.length>0 &&  <div className='w-full min-h-[100px] flex flex-col justify-center   p-[20px] bg-white  text-[22px]
                  text-gray-600 font-semibold shadow-lg rounded-lg'>
                    <div  className='text-[22px] text-gray-600'>Experience</div>
                    <div className='flex  flex-col justify-start items-start gap-[20px] p-[20px] text-gray-600'>
                   {profileData.experience.map((exp)=>(
                    <>
                    <div>Title: {exp.college}</div>
                     <div>Company: {exp.degree}</div>
                    <div>Description: {exp.fieldOfStudy}</div>
                    </>
                   ))}
                   {profileData._id==userData._id &&    <button className='min-w-[200px] h-[40px]  rounded-full border-2 border-[#2dc0ff]
                       text-[#2dc0ff] mt-[20px]  flex items-center justify-center gap-[10px]'
                        onClick={()=>setEdit(true)}>Add Experience</button>}
                 
                   </div>
                     </div>  }

             </div>
             
      </div>
    
  )
}

export default Profile
