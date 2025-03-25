import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { hashPassword, verifyPassword } from "@/utils/passwordUtility";
import { NextFunction, Request, response, Response } from "express";

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

        const hashedPassword = await hashPassword(password, 10)

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

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const allUsers = await db.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    res.status(200).json(new ApiResponse(200, "success", allUsers))
})

const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const user = await db.user.findUnique({
        where: {
            id
        }
    })

    if (!user) return next(new ApiError(404, "User Not Found", "404 not found"))

    res.status(200).json(new ApiResponse(200, "success", user))
})

const deleteUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const user = await db.user.delete({
        where: {
            id
        }

    })

    if (!user) return next(new ApiError(404, "User Not Found", "404 not found"))
    res.status(204).json(new ApiResponse(204, "user deleted successfully", null))

})

const updateUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { email,
        username,
        firstname,
        lastname,
        phone,
        dob,
        gender,
        image,
        role, } = req.body
    const user = await db.user.findUnique({
        where: {
            id
        }
    })

    if (!user) return next(new ApiError(404, "User Not Found", "404 not found"))

    if (email) {
        const emailExist = await db.user.findUnique({
            where: {
                email
            }
        })

        if (emailExist) return next(new ApiError(409, "Email already Exits", "Conflict"))
    }

    const updatedUser = await db.user.update({
        where: {
            id
        }, data: {
            email,
            username,
            firstname,
            lastname,
            phone,
            dob,
            gender,
            image,
            role,
        }
    })

    res.status(200).json(new ApiResponse(200, "User Updated successfully", updatedUser))

})

const updateUserPasswordById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { previousPassword, newPassword } = req.body

    if (!previousPassword || !newPassword) {
        return next(new ApiError(406, "Both fields are required", "Not Acceptable"))
    }

    const user = await db.user.findUnique({
        where: {
            id
        }
    })

    if (!user) return next(new ApiError(404, "User Not Found", "404 not found"))

    if (!await verifyPassword(previousPassword, user.password)) {
        return next(new ApiError(400, "Previous password is incorrect", "Bad request"))
    }

    const newHashedPassword = await hashPassword(newPassword, 10)

    const updatedUser = await db.user.update({
        where: {
            id
        }, data: {
            password: newHashedPassword
        }
    })

    res.status(200).json(new ApiResponse(200, "Password Updated Successfully", updatedUser))

})

export { registerUser, getAllUsers, getUserById, deleteUserById, updateUserById, updateUserPasswordById }