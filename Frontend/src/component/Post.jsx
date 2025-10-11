import React, { useEffect, useState } from 'react'
import pfofile from '../assets/pfofile.webp'
import moment from 'moment'
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { useContext } from 'react';
import { authDataContext } from '../context/Authcontext';
import axios from 'axios';
import { socket, userContextData } from '../context/UserContext';
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import ConnectionButton from './ConnectionButton'



function Post({ id, author, like, comment, description, image, createdAt }) {
    let [more, setMore] = useState()
    let [likes, setLikes] = useState( [])
    let[commentContent,setCommentContent]=useState("")
    let [comments,setComments]=useState([] )
    let[showComment,setShowComment]=useState(false)
    let { userData, setUserData, getPost,handleGetUserProfile } = useContext(userContextData)
    let { serverUrl } = useContext(authDataContext)
    const handleLike = async () => {
        try {
            let result = await axios.get(serverUrl + `/api/post/like/${id}`, { withCredentials: true })
            setLikes(result.data.like)
        } catch (error) {
            console.log(error)
        }
    }
    const handleComment = async (e) => {
        e.preventDefault()
        try {
            let result = await axios.post(serverUrl + `/api/post/comment/${id}`,{
                content:commentContent
            },{ withCredentials: true })
            setComments(result.data.comment)
          setCommentContent("")
           
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        socket.on("likesUpdated",({postId,likes})=>{
            if(postId==id){
                setLikes(likes)
            }
        })
        return()=>{
            socket.off("likesUpdated")
        }
    }),[]
      useEffect(()=>{
        socket.on("commentAdded",({postId,comm})=>{
            if(postId==id){
                setComments(comm)
            }
        })
        return()=>{
            socket.off("commentAdded")
        }
    }),[]

    useEffect(() => {
        setLikes(like)
        setComments(comment)
    }, [like,comment])

 




    return (
        <div className='w-full min-h-[200px] bg-white rounded-lg flex flex-col gap-[10px] shadow-lg p-[20px]'>
            <div className='flex justify-around items-center'>
                <div className=' flex justify-center items-start gap-[10px]' onClick={()=>{handleGetUserProfile(author.userName)
                    console.log(author.userName)
                }
                    
                }>
                    <div className='  w-[70px] h-[70px] rounded-full flex overflow-hidden  items-center justify-center
                   top-[65px] left-[35px] cursor-pointer' >
                        <img src={author.profileImage || pfofile} alt='dp' className='h-full w-full  ' />

                    </div>
                    <div>
                        <div className='text-gray-700 font-semibold text-[22px] ' >{`${author.firstName} ${author.lastName} `}</div>
                        <div className='text-gray-500  font-semibold text-[16px] '>{author.headline || ""}</div>
                        <div className='text-gray-500  font-semibold text-[16px] '>{moment(createdAt).fromNow()}</div>
                    </div>
                </div>
                <div>
                    {userData._id!=author._id && <ConnectionButton userId={author._id}/>}
                
                </div>
            </div>
            <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} pl-[50px]`}>{description}</div>
            <div className='pl-[50px] text-[19px] font-semibold cursor-pointer' onClick={() => setMore(prev => !prev)}>{more ? "read less.." : "read more......."}</div>

            {image && <div className='w-[full] h-[300px] overflow-hidden flex justify-center rounded-lg '>
                <img src={image} alt="" className='h-full rounded-lg' /></div>}
            <div>
                <div className='w-full  flex justify-between items-center p-[20px] border-b-2 border-gray-500'>
                    <div className='text-[20px] flex justify-center items-center gap-[5px]'>
                        <BiLike className='text-[#1ebbff] w-[20px] h-[20px]' /><span>{likes.length}</span></div>
                    <div className='flex items-center justify-center gap-[5px] text-[18px] cursor-pointer'><span>{comment.length}</span><span  onClick={()=>setShowComment(prev=>!prev)}>comment</span></div>
                </div>
                <div className='flex justify-between items-center w-full p-[20px] '>
                    {!likes.includes(userData._id) && <div className='flex justify-center items-center  gap-[5px]' onClick={handleLike} >
                        <BiLike className=' w-[24px] h-[24px]' /><span>Like</span>
                    </div>}


                    {likes.includes(userData._id) && <div className='flex justify-center items-center  gap-[5px]'  onClick={handleLike} >
                        <BiSolidLike className=' w-[24px] h-[24px] text-[#07a4ff]' /><span className='text-[#07a4ff]'>Liked</span>
                    </div>}
                    <div className='flex justify-center items-center  gap-[5px] cursor-pointer' onClick={()=>setShowComment(prev=>!prev)}>
                        <FaRegCommentDots className=' w-[24px] h-[24px] cursor-pointer'
                         onClick={()=>setShowComment(prev=>!prev)}/><span>Comment</span></div>
                </div>
            </div>
            {showComment &&  <div>
                <form onSubmit={handleComment} className='w-full flex justify-between items-center border-b-gray-300 border-b-2 p-[20px]'>
                    <input type='text' placeholder={"leave a comment"} className='outline-none'value={commentContent} onChange={(e)=>setCommentContent(e.target.value)} />
                    <button><LuSendHorizontal  className='w-[22px] h-[22px] text-[#07a4ff]  ' /></button>
                    
                </form>
                <div className=' flex flex-col gap-[10px]'>
                   {comments.map((com)=>(
                    <div className='flex flex-col gap-[10px] border-b-2 p-[20px]'>
                        <div className='w-full flex justify-start items-center gap-[10px]' >
                              <div className='  w-[70px] h-[70px] rounded-full flex overflow-hidden  items-center justify-center
                   top-[65px] left-[35px] cursor-pointer' >
                    
                        <img src={com.user.profileImage || pfofile} alt='dp' className='h-full w-full  ' /></div>
                        <div>
                        <div className='text-gray-700 font-semibold text-[22px] ' >{`${com.user.firstName} ${com.user.lastName} `}</div>
                        <div>{moment(com.createdAt).fromNow()}</div>
                        </div>
                        </div>
                        <div className='pl-[80px]'>
                            {com.content}
                        </div>
                    </div>

                   ))}     
                </div>
            </div>
 }
          

        </div >
    )
}

export default Post
