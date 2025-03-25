import { Router } from "express";
import { registerUser } from "@/controllers/users.controller"

const userRouter = Router()

userRouter.post("/", registerUser)
export default userRouter

