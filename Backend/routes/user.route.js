import  express from "express"
import { getCurrentUser, getSuggestedUser, getUserProfile, search, updateProfile } from "../controllers/user.controller.js"
import isAuthanticate from "../middleware/isAuthanticated.js"
import upload from "../middleware/multer.js"
let userRouter = express.Router()
userRouter.get("/currentuser",isAuthanticate,getCurrentUser)


userRouter.put("/updateprofile",isAuthanticate,upload.fields([
    {name:"profileImage",maxCount:1},
    {name:"coverImage",maxCount:1}
]),updateProfile)

userRouter.get("/profile/:userName",isAuthanticate,getUserProfile)
userRouter.get("/search",isAuthanticate,search)
userRouter.get("/suggesteduser",isAuthanticate,getSuggestedUser)

export default userRouter