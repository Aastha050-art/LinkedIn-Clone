import express from "express"
import isAuthanticate from "../middleware/isAuthanticated.js"
import { acceptConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../controllers/connection.controller.js"
let connectionRouter=express.Router()
connectionRouter.post("/send/:id",isAuthanticate,sendConnection)
connectionRouter.put("/accept/:connectionId",isAuthanticate,acceptConnection)
connectionRouter.put("/reject/:connectionId",isAuthanticate,rejectConnection)
connectionRouter.get("/getstatus/:userId",isAuthanticate,getConnectionStatus)
connectionRouter.delete("/remove/:userId",isAuthanticate,removeConnection)
connectionRouter.get("/requests",isAuthanticate,getConnectionRequests)
connectionRouter.get("/",isAuthanticate,getUserConnections)

export default connectionRouter