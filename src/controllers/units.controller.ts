import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";


const createUnit = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, abbreviation, slug } = req.body;

    if ([name, abbreviation].some((field) => !field)) {
        return next(new ApiError(403, "all fields are required", "forbidden"))
    }

    const unitExist = await db.unit.findFirst({
        where: {
            slug
        }
    })

    if (unitExist) {
        return next(new ApiError(409, `Unit of (${name}) already exist`, "Conflict"))
    }

    const unit = await db.unit.create({
        data: {
            name, slug, abbreviation
        }
    })

    res.status(201).json(new ApiResponse(201, "Unit  Created Successfully", unit))
})

const getUnitById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params

    const unit = await db.unit.findUnique({
        where: {
            id
        }
    })

    if (!unit) {
        return next(new ApiError(404, "Unit Does not Exits", "Not Found"))
    }

    res.status(200).json(new ApiResponse(200, "Unit Get SuccessFully", unit))
})

const getUnits = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const units = await db.unit.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "All units Get Successfully", units))
})


const deleteUnitById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const unit = await db.unit.delete({
        where: {
            id
        }

    })

    if (!unit) return next(new ApiError(404, "Unit Not Found", "404 not found"))
    res.status(204).json(new ApiResponse(204, "Unit deleted successfully", null))

})

const updateUnitById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, abbreviation, slug } = req.body;

    const unit = await db.unit.findUnique({
        where: {
            id
        }
    })

    if (!unit) return next(new ApiError(404, "Unit Not Found", "404 not found"));

    if (slug && slug !== unit.slug) {
        const slugExit = await db.brand.findUnique({
            where: { slug }
        });

        if (slugExit) return next(new ApiError(409, "Slug already Exits", "Conflict"));
    }


    const updatedUnit = await db.unit.update({
        where: { id },
        data: {
            name,
            abbreviation,
            slug
        }
    })

    res.status(200).json(new ApiResponse(204, "Unit updated successfully", updatedUnit))

})




export { createUnit, getUnitById, getUnits, deleteUnitById, updateUnitById }
