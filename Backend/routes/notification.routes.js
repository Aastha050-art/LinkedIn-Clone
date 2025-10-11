import express from "express"
import isAuthanticate from "../middleware/isAuthanticated.js"
import { clearAllNotification, deleteNotification, getNotification } from "../controllers/notification.controller.js"
let notificationRouter=express.Router()
notificationRouter.get("/get",isAuthanticate,getNotification)
notificationRouter.delete("/deleteone/:id",isAuthanticate,deleteNotification)
notificationRouter.delete("/",isAuthanticate,clearAllNotification)
export default notificationRouter