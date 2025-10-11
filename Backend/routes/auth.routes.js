import express from "express"
import { signUp,login,logOut } from "../controllers/auth.controllers.js"
let authrouter=express.Router()

authrouter.post("/signup",signUp)

authrouter.post("/login",login)
authrouter.get("/logout",logOut)

export default authrouter; 