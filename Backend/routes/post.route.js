import express from "express"
import isAuthanticate from "../middleware/isAuthanticated.js"
import upload from "../middleware/multer.js"
import { comment, createPost, getPost, like } from "../controllers/post.controller.js"
let postRouter=express.Router()

postRouter.post("/create",isAuthanticate,upload.single("image"),createPost)
postRouter.get("/getpost",isAuthanticate,getPost)
postRouter.get("/like/:id",isAuthanticate,like)
postRouter.post("/comment/:id",isAuthanticate,comment)

export default postRouter