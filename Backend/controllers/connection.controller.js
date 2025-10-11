import Connection from "../modles/connection.model.js";
import User from "../modles/user.model.js";
import { io,userSocketMap } from "../index.js";
import Notification from "../modles/notification.model.js";


export const sendConnection = async (req, res) => {
    try {
        let { id } = req.params
        let sender = req.userId
        let user = await User.findById(sender)
        if (sender == id) {
            return res.status(400).json({ message: "you can not send request to yourself" })
        }
        if (user.connection.includes(id)) {
            return res.status(400).json({ message: "you are already connected" })
        }
        let existingConnection = await Connection.findOne({
            sender,
            receiver: id,
            status: "pending"
        })
        if (existingConnection) {
            return res.status(400).json({ message: "request already exist" })
        }
        let newRequest = await Connection.create({
            sender, receiver: id
        })
        let receiverSocketId=userSocketMap.get(id)
        let senderSocketId=userSocketMap.get(sender)

         if(receiverSocketId){
          
        io.to(receiverSocketId).emit("statusUpdate",{updatedUserId:sender,newStatus:"received"})
    }
          if(senderSocketId){
           

        io.to(senderSocketId).emit("statusUpdate",{updatedUserId:id,newStatus:"pending"})
    }
    

        return res.status(200).json(newRequest)
    } catch (error) {
        return res.status(500).json({ message: `send connection error ${error}` })
    }
}
export const acceptConnection = async (req, res) => {
    try {
        const { connectionId } = req.params
        let userId=req.userId
       
        let connection = await Connection.findById(connectionId)
        
        if (!connection) {
            return res.status(400).json({ message: "connection does not exist" })
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }
          
        connection.status="accepted"
           let notification = await Notification.create({
            receiver:connection.sender,
            type:"connectionAccepted",
            relatedUser:userId
        
        });
     
        await connection.save()
      
       
        await User.findByIdAndUpdate(req.userId, {
            $addToSet: { connection: connection.sender._id }
        })

        await User.findByIdAndUpdate(connection.sender._id, {
            $addToSet: { connection: req.userId }
        })

           let receiverSocketId=userSocketMap.get(connection.receiver._id.toString())
        let senderSocketId=userSocketMap.get(connection.sender._id.toString())


             if(receiverSocketId){
        io.to(receiverSocketId).emit("statusUpdate",{updatedUserId:connection.sender._id,newStatus:"disconnect"})
    }
          if(senderSocketId){
        io.to(senderSocketId).emit("statusUpdate",{updatedUserId:req.userId,newStatus:"disconnect"})
    }
    

        return res.status(200).json({ message: "connection accepted" })
    } catch (error) {
        return res.status(500).json({ message: "connection accepted error" ,error })
    }
}
export const rejectConnection = async (req, res) => {
    try {
        let { connectionId } = req.params
        let connection = await Connection.findById(connectionId)
        if (!connection) {
            return res.status(400).json({ message: "connection does not exist" })
        }
        if (connection.status != "pending") {
            return res.status(400).json({ message: "request under process" })
        }
        connection.status = "rejected"
        await connection.save()
    await connection.save()
        return res.status(200).json({ message: "connection rejected" })
    } catch (eror) {
        return res.status(500).json({ message: "connection rejected error ${error}" })
    }
}
export const getConnectionStatus = async(req,res)=>{
    try{
const targetUserId=req.params.userId
const currentUserId=req.userId
let currentUser=await User.findById(currentUserId)
if(currentUser.connection.includes(targetUserId)){
    return res.json({status:"disconnect"})
}
const pendindRequest= await Connection.findOneAndUpdate({
    $or:[
        
      {sender:currentUserId,receiver:targetUserId},
       {sender:targetUserId,receiver:currentUserId},
        
    ],
   status:"pending",
});

 if(pendindRequest){
 if(pendindRequest.sender.toString()===currentUserId.toString()){
     return res.json({status:"pending"});
    }else{
        return res.json({status:"received", requestId: pendindRequest._id});
    }
}
   return res.json({status:"connect"});

    }catch(error){
      return res.status(500).json({message:"getConnectionStatus error"})
    }
};
export const removeConnection =async(req,res)=>{
    try{
       const myId= req.userId;
       const otherUserId= req.params.userId;

       await User.findByIdAndUpdate(myId,{$pull:{connection:otherUserId}});
       await User.findByIdAndUpdate(otherUserId,{$pull:{connection:myId}});


               let receiverSocketId=userSocketMap.get(otherUserId)
        let senderSocketId=userSocketMap.get(myId)
console.log(receiverSocketId,senderSocketId,"remove error")

             if(receiverSocketId){
        io.to(receiverSocketId).emit("statusUpdate",{updatedUserId:myId,newStatus:"connect"})
    }
          if(senderSocketId){
        io.to(senderSocketId).emit("statusUpdate",{updatedUserId:otherUserId,newStatus:"connect"})
    }
    

   

      return res.json({message:"Connection removed successfully"})
    }catch(error){
      return res.status(500).json({message:"removeConnection error"})
    }
}
export const getConnectionRequests =async(req,res)=>{
    try{
       const userId= req.userId;
     
      const requests = await Connection.find({receiver:userId,status:"pending"})
      .populate("sender","firstName lastName email userName profileImage headline")
      return res.status(200).json(requests)
    }catch(error){
        console.error("error in getConnectionRequests:",error)
      return res.status(500).json({message:"server Err"})
    }
}
export const getUserConnections =async(req,res)=>{
    try{
       const userId= req.userId;
     
      const user = await User.findById(userId)
      .populate("connection","firstName lastName email userName profileImage headline connection")
      return res.status(200).json(user.connection)
    }catch(error){
        console.error("error in getUserConnections:",error)
      return res.status(500).json({message:"server Err"})
    }
}