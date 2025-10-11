import React, { useContext, useRef, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userContextData } from '../context/UserContext';
import { FiPlus } from "react-icons/fi";
import pfofile from '../assets/pfofile.webp'
import { FiCamera } from "react-icons/fi";
import axios from 'axios';
import { authDataContext } from '../context/Authcontext';


function EditProfile() {
  let {serverUrl}=useContext(authDataContext)
  let { edit, setEdit, userData,setUserData } = useContext(userContextData)
  let [firstName, setFirstname] = useState(userData.firstName || "")
  let [lastName, setLastname] = useState(userData.lastName || "")
  let [userName, setUsername] = useState(userData.userName || "")
  let [headline, setHeadline] = useState(userData.headline || "")
  let [location, setLocation] = useState(userData.location || "")
  let [gender, setGender] = useState(userData.gender || "")
  let [skills, setSkills] = useState(userData.skills || [])
  let [newSkills, setNewskills] = useState("")
  let [education, setEducation] = useState(userData.education || [])
  let [newEducation, setNeweducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: ""
  })
    let [experience, setExperience] = useState(userData.education || [])
  let [newExperience, setNewexperience] = useState( {
        title:"",
        company:"",
        description:""
    })
  const profileImage=useRef()
  const coverImage=useRef()

let[frontendProfileImage,setFrontendProfile]=useState(userData.profileImage||pfofile)
let[backendProfileImage,setBackendProfile]=useState(null)

let[frontendCoverImage,setFrontendCover]=useState(userData.coverImage)
let[backendCoverImage,setBackendCover]=useState(null)

let[saving,setSaving]=useState(false)



  function addSkills(e) {
    e.preventDefault
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills])
    }
    setNewskills("")
  }
  function addEducation(e) {
    e.preventDefault
    if (newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
      setEducation([...education, newEducation])
    }
    setNeweducation({
    college: "",
    degree: "",
    fieldOfStudy: ""
  })
  }
  function addExperience(e) {
    e.preventDefault
    if (newExperience.title && newExperience.company && newExperience.description) {
      setExperience([...experience, newExperience])
    }
    setNewexperience({
    title: "",
    company: "",
    description: ""
  })
  }
  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill))
    }
  }
  function removeEducation(edu){
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu))
    }
  }
    function removeExperience(exp){
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp))
    }
  }
  function handleProfileImage(e){
    let file=e.target.files[0]
    setBackendProfile(file)
    setFrontendProfile(URL.createObjectURL(file))
  }
    function handleCoverImage(e){
    let file=e.target.files[0]
    setBackendCover(file)
    setFrontendCover(URL.createObjectURL(file))
  }
  const handleSaveProfile=async ()=>{
    setSaving(true)
    try{
     let formdata=new FormData()
    formdata.append("firstName",firstName)
    formdata.append("lastName",lastName)
    formdata.append("userName",userName)
    formdata.append("headline",headline)
    formdata.append("location",location)
    formdata.append("skills",JSON.stringify(skills))
    formdata.append("experience",JSON.stringify(experience))
    formdata.append("education",JSON.stringify(education))
    formdata.append("gender",gender)
   
    if(backendProfileImage){
      formdata.append("profileImage",backendProfileImage)
     
      
    }
     if(backendCoverImage){
      formdata.append("coverImage",backendCoverImage)
       
    }
     let result =await axios.put(serverUrl+"/api/user/updateprofile",formdata,{withCredentials:true})
    
    setUserData(result.data)
    setSaving(false)
    setEdit(false)
    }catch(error){
     
      setSaving(false)
    }
  }


  

  return (
    <div className='w-full h-[100vh] fixed top-0   z-[100] flex items-center justify-center  '>
      <input type='file' accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type='file' accept='image/*' hidden ref={coverImage} onChange={handleCoverImage}/>
      <div className='w-full h-[100vh]  top-0 bg-black opacity-[0.5] z-[100] absolute  left-0  '></div>
      <div className='w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] overflow-auto shadow-lg rounded-lg p-[10px] '>
        <div className='absolute top-[20px] right-[20px] cursor-pointer '><RxCross1 className='w-[25px] h-[25px]
           text-gray-800 font-bold cursor-pointer' onClick={() => setEdit(false)} /></div>
        <div className='w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] relative' onClick={()=>coverImage.current.click()}>
          <img src={frontendCoverImage} alt='c' className='w-full h-[150px]' />
          <div className='w-[25px] h-[25px] text-[white] absolute right-[25px] top-[20px] '>
            <FiCamera className='w-[25px] h-[25px]' />
          </div>
        </div>
        <div className='w-[80px] h-[80px] rounded-full overflow-x-hidden absolute top-[150px] ml-[20px]  ' onClick={()=>profileImage.current.click()}>
          <img src={frontendProfileImage} alt='p' className='w-full h-full' />
        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff]  absolute top-[200px] left-[90px] rounded-full flex items-center
                 text-white justify-center cursor-pointer'>
          <FiPlus />
        </div>
        <div>
          <div className='w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]'>
            <input type='text' placeholder='firstName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[18px] border-[2px] rounded-lg' value={firstName} onChange={(e) => setFirstname(e.target.value)} />
            <input type='text' placeholder='lastName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[18px] border-[2px] rounded-lg' value={lastName} onChange={(e) => setLastname(e.target.value)} />
            <input type='text' placeholder='userName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[18px] border-[2px] rounded-lg' value={userName} onChange={(e) => setUsername(e.target.value)} />
            <input type='text' placeholder='headline' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px]
             text-[18px] border-[2px] rounded-lg' value={headline} onChange={(e) => setHeadline(e.target.value)} />
            <input type='text' placeholder='location' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[18px] border-[2px] rounded-lg' value={location} onChange={(e) => setLocation(e.target.value)} />
            <input type='text' placeholder='gender(male/female/other)' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[18px] border-[2px] rounded-lg' value={gender} onChange={(e) => setGender(e.target.value)} />
            <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
              <h1 className='text-[19px] font-semibold'>Skills</h1>
              {skills && <div>
                {skills.map((skill, index) => (
                  <div key={index} className='w-full h-[40px] border-[1px] border-gray-600 bg-gray-200
                   rounded-lg p-[10px] flex justify-between items-center'><span>{skill}</span><RxCross1 className='w-[20px] h-[20px]
           text-gray-800 font-bold cursor-pointer' onClick={() => removeSkill(skill)} /> </div>))}
              </div>
              }
              <div className=' flex flex-col gap-[10px] items-start' >
                <input type='text' placeholder='add new skill' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[16px] border-[2px] rounded-lg'  value={newSkills} onChange={(e) => setNewskills(e.target.value)} />
                <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] '
                  onClick={addSkills}>Add</button>
              </div>
            </div>
            <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
              <h1 className='text-[19px] font-semibold'>Education</h1>
              {education && <div>
                {education.map((edu,index) => (
                  <div key={index} className='w-full  border-[1px] border-gray-600 bg-gray-200
                   rounded-lg p-[10px] flex justify-between items-center'>
                    <div>
                      <div>College:{edu.college}</div>
                      <div>Degree:{edu.degree}</div>
                      <div>Field Of Study:{edu.fieldOfStudy}</div>
                    </div>
                    <RxCross1 className='w-[20px] h-[20px]
           text-gray-800 font-bold cursor-pointer' onClick={()=>{removeEducation(edu)}} /> </div>))}
              </div>
              }
              <div className=' flex flex-col gap-[10px] items-start' >
                <input type='text' placeholder='add college' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[16px] border-[2px]
             rounded-lg'  value={newEducation.college} onChange={(e) => setNeweducation({ ...newEducation, college: e.target.value })} />

             <input type='text' placeholder='add degree' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[16px] border-[2px]
             rounded-lg'  value={newEducation.degree} onChange={(e) => setNeweducation({ ...newEducation, degree: e.target.value })} />

             <input type='text' placeholder='add field of study' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[16px] border-[2px]
             rounded-lg'  value={newEducation.fieldOfStudy} onChange={(e) => setNeweducation({ ...newEducation, fieldOfStudy: e.target.value })} />

                <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] '
                  onClick={addEducation}>Add</button>
              </div>
            </div>
              <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
              <h1 className='text-[19px] font-semibold'>Experience</h1>
              {experience && <div>
                {experience.map((exp,index) => (
                  <div key={index} className='w-full  border-[1px] border-gray-600 bg-gray-200
                   rounded-lg p-[10px] flex justify-between items-center'>
                    <div>
                      <div>Title:{exp.title}</div>
                      <div>Company:{exp.company}</div>
                      <div>Description:{exp.description}</div>
                    </div>
                    <RxCross1 className='w-[20px] h-[20px]
           text-gray-800 font-bold cursor-pointer' onClick={()=>{removeExperience(exp)}} /> </div>))}
              </div>
              }
              <div className=' flex flex-col gap-[10px] items-start' >
                <input type='text' placeholder='title' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[16px] border-[2px]
             rounded-lg'  value={newExperience.title} onChange={(e) => setNewexperience({ ...newExperience, title: e.target.value })} />

             <input type='text' placeholder='company' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[16px] border-[2px]
             rounded-lg'  value={newExperience.company} onChange={(e) => setNewexperience({ ...newExperience, company: e.target.value })} />

             <input type='text' placeholder='Description' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] 
            text-[16px] border-[2px]
             rounded-lg'  value={newExperience.description} onChange={(e) => setNewexperience({ ...newExperience, description: e.target.value })} />

                <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] '
                  onClick={addExperience}>Add</button>
              </div>
            </div>  
            
        <button className='w-[100%] h-[50px] rounded-full bg-[#1dc9fd] mt-[30px] text-white ' onClick={()=>handleSaveProfile()}>{saving?"Saving...":"Save Profile"}</button>         
          </div>
        </div>

      </div>

    </div>
  )
}

export default EditProfile
