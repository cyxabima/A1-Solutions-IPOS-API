import { Router } from "express";
import { deleteUserById, getAllUsers, getUserById, registerUser, updateUserById, updateUserPasswordById } from "@/controllers/users.controller"

const userRouter = Router()

// user routes 

userRouter.post("/", registerUser)
userRouter.get("/", getAllUsers)
userRouter.get("/:id", getUserById)
userRouter.put("/:id", updateUserById)
userRouter.patch("/update-password/:id", updateUserPasswordById)
userRouter.delete("/:id", deleteUserById)

export default userRouter

