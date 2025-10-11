import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import connectionRouter from "./routes/connection.route.js";
import http from "http"
import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes.js";


dotenv.config()

const app=express();
let server=http.createServer(app)
 export const io=new Server(server,{
    cors:({
    origin:" https://linkedin-frontend-zmcr.onrender.com",
    credentials:true
})
})
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:" https://linkedin-frontend-zmcr.onrender.com",
    credentials:true
}))
let port=process.env.PORT||5000
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/notification",notificationRouter)

export const userSocketMap= new Map()

 io.on("connection",(socket)=>{

    console.log("user connected",socket.id)
    socket.on("register",(userId)=>{
        userSocketMap.set(userId,socket.id)
       
    })
    socket.on("disconnect",(socket)=>{
        console.log("user disconnected",socket.id)
    })
})
server.listen(port,()=>{
    connectDb()
    console.log("start")
})
