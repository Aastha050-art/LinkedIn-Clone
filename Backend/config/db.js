import dotenv, { config } from "dotenv"
dotenv.config()
import mongoose from "mongoose";
const connectDb=async()=>{
    try{
       await mongoose.connect("mongodb+srv://aasthamalviya510:51VK0RQg3QyAOiaL@cluster0.eojrxpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("db connected");
    }catch(error){
        console.log("db error",error.message);
    }
}
export default connectDb;