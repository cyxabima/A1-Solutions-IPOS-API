import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { hash } from "bcrypt";
import { NextFunction, Request, Response } from "express";

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            email,
            username,
            firstname,
            lastname,
            password,
            phone,
            dob,
            gender,
            image,
            role,

        } = req.body;

        if ([email,
            username,
            firstname,
            lastname,
            password,
            phone,
            gender,
            role,].some((any) => any?.trim() == "")) {
            return next(new ApiError(400, "All fields are required", "must enter all fields"))

        }

        const existingUserByEmail = await db.user.findUnique({
            where: {
                email
            }

        })

        if (existingUserByEmail) return next(new ApiError(409, "user Already Exits", "Plz login or use another email"))

        const existingUserByUserName = await db.user.findUnique({
            where: {
                username
            }

        })

        if (existingUserByUserName) return next(new ApiError(409, "User name is taken", "Plz use another username"))

        const hashedPassword = await hash(password, 10)

        const newUser = await db.user.create({
            data: {
                email,
                username,
                firstname,
                lastname,
                phone,
                dob: dob || null,
                gender,
                image: image || "https://www.ferill.is/wp-content/uploads/2020/11/avatar-placeholder.png",
                role,
                password: hashedPassword
            }

        })
        const { password: _, ...userWithoutPassword } = newUser; // as password is defined there we cant re define in ts there renaming it

        res.status(201).json(new ApiResponse(201, "User registered Successfully", userWithoutPassword))

    } catch (error) {
        console.error(error)
        return next(error)
    }


}


export { registerUser }