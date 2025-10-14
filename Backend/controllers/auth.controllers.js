import bcrypt from "bcryptjs"
import User from "../modles/user.model.js"
import genToken from "../config/token.js"
export const signUp=async(req,res)=>{
    try{
        let{firstName,lastName,userName,email,password}=req.body
        let existemail= await User.findOne({email})
        if(existemail){
            return res.status(400).json({message:"email alredy exit!"})
        }
         let existusername= await User.findOne({userName})
        if(existusername){
            return res.status(400).json({message:"username alredy exit!"})
        }
        if(password.length<8){
            return res.status(400).json({message:"password must be atleast 8 characters"})
        }
        let hassPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            firstName,
            lastName,
            userName,
            email,
            password:hassPassword
        })

        let token= await genToken(user._id)
        res.cookie("token",token,{
         httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"none",
        secure: true,
         })

        return res.status(201).json(user)

    }catch(error){
         console.log(error.message);
       return res.status(500).json({message:error})
    }
    
}

//login
export const login =async(req,res)=>{
    try{
 let{email,password}=req.body
        let user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user does not exist!"})
        }
       
       const isMatch= await bcrypt.compare(password,user.password)
       if(!isMatch){
        return res.status(400).json({message:"incorrect password"})
       }
      

        let token= await genToken(user._id)
        res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure: process.env.NODE_ENV==="production"
         })
         
       
        return res.status(200).json(user)
        

    }catch(error){
      console.log(error.message);
    
       return res.status(500).json({message:"login error"})
    }
}
export const logOut= async(req,res)=>{
    try{
        res.clearCookie("token")
         return res.status(200).json({message:"logout successfully"})
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"logout"})
    }
}
