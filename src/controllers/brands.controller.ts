import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";


const createBrand = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug } = req.body;

    if ([name, slug].some((field) => !field)) {
        return next(new ApiError(403, "all fields are required", "forbidden"))
    }

    const brandExist = await db.brand.findFirst({
        where: {
            slug
        }
    })

    if (brandExist) {
        return next(new ApiError(409, `Brand of (${name}) already exist`, "Conflict"))
    }

    const brand = await db.brand.create({
        data: {
            name, slug
        }
    })

    res.status(201).json(new ApiResponse(201, "Brand  Created Successfully", brand))
})

const getBrandById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params

    const brand = await db.brand.findUnique({
        where: {
            id
        }
    })

    if (!brand) {
        return next(new ApiError(404, "Brand Does not Exits", "Not Found"))
    }

    res.status(200).json(new ApiResponse(200, "Brand Get SuccessFully", brand))
})

const getBrands = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const brands = await db.brand.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "All brands Get Successfully", brands))
})


const deleteBrandById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const brand = await db.brand.delete({
        where: {
            id
        }

    })

    if (!brand) return next(new ApiError(404, "Brand Not Found", "404 not found"))
    res.status(204).json(new ApiResponse(204, "Brand deleted successfully", null))

})

const updateBrandById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, slug } = req.body;

    const brand = await db.brand.findUnique({
        where: {
            id
        }
    })

    if (!brand) return next(new ApiError(404, "Brand Not Found", "404 not found"));
    
    if (slug && slug !== brand.slug) {
        const slugExit = await db.brand.findUnique({
            where: { slug }
        });

        if (slugExit) return next(new ApiError(409, "Slug already Exits", "Conflict"));
    }

    const updatedBrand = db.brand.update({
        where: { id },
        data: {
            name,
            slug
        }
    })

    res.status(200).json(new ApiResponse(204, "Brand updated successfully", updatedBrand))

})




export { createBrand, getBrandById, getBrands, deleteBrandById, updateBrandById }
