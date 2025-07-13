import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { generateAccessToken } from "@/utils/jwtUtils";
import { verifyPassword } from "@/utils/passwordUtility";
import { NextFunction, Request, Response } from "express";

const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    if (!password) {
        return next(new ApiError(400, "Password is required", "Bad Request"));
    }

    if (!username && !email) {
        return next(new ApiError(400, "Username or Email is required", "Bad Request"));
    }

    let user;
    if (email) {
        user = await db.user.findUnique({
            where: {
                email
            }
        })
    } else if (username) {
        user = await db.user.findUnique({
            where: {
                username
            }
        })
    }

    if (!user || !verifyPassword(String(password), user.password)) {
        return next(new ApiError(401, "Invalid credentials", "Unauthorized"));
    }
    const { password: _, ...userWithoutPass } = user;

    const accessToken = generateAccessToken(userWithoutPass);

    const result = {
        ...userWithoutPass,
        accessToken
    }

    res.status(200).json(new ApiResponse(200, "login Successfully", result))
})


export { loginUser }