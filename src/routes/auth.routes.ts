import { loginUser } from "@/controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/login', loginUser);


export default authRouter