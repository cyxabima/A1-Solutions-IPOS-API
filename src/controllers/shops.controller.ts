import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";


const createShop = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, location, adminId, attendantIds } = req.body
    if ([name, location, adminId, attendantIds].some((field) => !field)) {
        return next(new ApiError(403, "all fields are required", "forbidden"))
    }

    const slug = String(name).toLocaleLowerCase().replace(/\s+/g, "-") // use or regex
    const shopExist = await db.shop.findFirst({
        where: {
            slug
        }
    })

    if (shopExist) {
        return next(new ApiError(409, `shop with name (${name}) already exist`, "Conflict"))
    }

    const shop = await db.shop.create({
        data: {
            name, slug, location, adminId, attendantIds
        }
    })

    res.status(201).json(new ApiResponse(201, "Shop  Created Successfully", shop))
})

const getShopById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { shopId } = req.params

    const shop = await db.shop.findFirst({
        where: {
            id: shopId
        }
    })

    if (!shop) {
        return next(new ApiError(404, "Shop Does not Exits", "Not Found"))
    }

    res.status(200).json(new ApiResponse(200, "Shop Get SuccessFully", shop))
})

const getShops = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const shops = await db.shop.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "All Shops Get Successfully", shops,))
})


const getShopAttendants = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { shopId } = req.params;
    const shop = await db.shop.findFirst({
        where: {
            id: shopId
        }
    })

    if (!shop) {
        return next(new ApiError(404, "Shop Does not Exits", "Not Found"))
    }

    const attendants = await db.user.findMany({
        where: {
            id: {
                in: shop.attendantIds

            }
        },
        select: {
            firstname: true,
            lastname: true,
            username: true,
            email: true,
            gender: true,
            phone: true,
        }
    })


    res.status(200).json(new ApiResponse(200, "Attendants Founds", attendants))

})

export { createShop, getShopById, getShopAttendants, getShops }
