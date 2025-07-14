import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";


const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug } = req.body;

    if ([name, slug].some((field) => !field)) {
        return next(new ApiError(403, "all fields are required", "forbidden"))
    }

    const CategoryExist = await db.category.findFirst({
        where: {
            slug
        }
    })

    if (CategoryExist) {
        return next(new ApiError(409, `Category of (${name}) already exist`, "Conflict"))
    }

    const Category = await db.category.create({
        data: {
            name, slug
        }
    })

    res.status(201).json(new ApiResponse(201, "Category  Created Successfully", Category))
})

const getCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params

    const Category = await db.category.findUnique({
        where: {
            id
        }
    })

    if (!Category) {
        return next(new ApiError(404, "Category Does not Exits", "Not Found"))
    }

    res.status(200).json(new ApiResponse(200, "Category Get SuccessFully", Category))
})

const getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const Categories = await db.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "All Categories Get Successfully", Categories))
})


const deleteCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const Category = await db.category.delete({
        where: {
            id
        }

    })

    if (!Category) return next(new ApiError(404, "Category Not Found", "404 not found"))
    res.status(204).json(new ApiResponse(204, "Category deleted successfully", null))

})

const updateCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, slug } = req.body;

    const Category = await db.category.findUnique({
        where: {
            id
        }
    })

    if (!Category) return next(new ApiError(404, "Category Not Found", "404 not found"));

    if (slug && slug !== Category.slug) {
        const slugExit = await db.category.findUnique({
            where: { slug }
        });
        
        if (slugExit) return next(new ApiError(409, "Slug already Exits", "Conflict"));
    }

    const updatedCategory = db.category.update({
        where: { id },
        data: {
            name,
            slug
        }
    })

    res.status(200).json(new ApiResponse(204, "Category updated successfully", updatedCategory))

})




export { createCategory, getCategoryById, getCategories, deleteCategoryById, updateCategoryById }
