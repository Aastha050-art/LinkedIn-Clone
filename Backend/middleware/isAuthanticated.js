import jwt from "jsonwebtoken"
const isAuthanticate= async (req,res,next)=>{
  try{
     let {token}= req.cookies
     
    if(!token){
        return res.status(400).json({message:"User doesn't have token "})
      
    }
    let verifyToken=  jwt.verify(token,process.env.JWT_SECRETE)
    if(!verifyToken){
      return res.status(400).json({message:"User doesn't have valid token "})  
    }
     req.userId= verifyToken.userId
     next()
    }catch(error){
        return res.status(500).json({message: "Is authanticate error" })
    }
}  

export default isAuthanticate