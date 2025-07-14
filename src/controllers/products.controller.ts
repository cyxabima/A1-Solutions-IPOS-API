import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";


const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        description,
        alertQty,
        stockQty,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
    } = req.body;


    const productExist = await db.product.findFirst({
        where: {
            slug
        }
    })

    if (productExist) {
        return next(new ApiError(409, `product of (${name}) already exist`, "Conflict"))
    }

    const skuExits = await db.product.findUnique(
        { where: { sku } }
    )
    if (skuExits) {
        return next(new ApiError(409, `product sku: (${sku}) already exist`, "Conflict"))

    }

    const prodCodeExits = await db.product.findUnique(
        { where: { productCode } }
    )
    if (prodCodeExits) {
        return next(new ApiError(409, `product code: (${prodCodeExits}) already exist`, "Conflict"))

    }

    const product = await db.product.create({
        data: {
            name,
            description,
            alertQty,
            stockQty,
            buyingPrice,
            sku,
            productCode,
            slug,
            supplierId,
            unitId,
            brandId,
            categoryId
        }
    })

    res.status(201).json(new ApiResponse(201, "Product Created Successfully", product))
})

const getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params

    const product = await db.product.findUnique({
        where: {
            id
        }
    })

    if (!product) {
        return next(new ApiError(404, "Product Does not Exits", "Not Found"))
    }

    res.status(200).json(new ApiResponse(200, "Product Get SuccessFully", product))
})

const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const products = await db.product.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "All products Get Successfully", products))
})


const deleteProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const product = await db.product.delete({
        where: {
            id
        }

    })

    if (!product) return next(new ApiError(404, "Product Not Found", "404 not found"))
    res.status(204).json(new ApiResponse(204, "Product deleted successfully", null))

})

const updateProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {
        name,
        description,
        alertQty,
        stockQty,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
    } = req.body;



    const product = await db.product.findUnique({
        where: {
            id
        }
    })

    if (!product) return next(new ApiError(404, "Product Not Found", "404 not found"));

    if (slug && slug !== product.slug) {

        const slugExit = await db.product.findUnique({
            where: { slug }
        });

        if (slugExit) return next(new ApiError(409, "Slug already Exits", "Conflict"));
    }

    if (sku && sku !== product.sku) {
        const skuExits = await db.product.findUnique(
            { where: { sku } }
        )
        if (skuExits) {
            return next(new ApiError(409, `product sku: (${sku}) already exist`, "Conflict"))

        }
    }

    if (productCode && productCode !== product.productCode) {
        const prodCodeExits = await db.product.findUnique(
            { where: { productCode } }
        )
        if (prodCodeExits) {
            return next(new ApiError(409, `product code: (${prodCodeExits}) already exist`, "Conflict"))

        }
    }



    const updateProduct = db.product.update({
        where: { id },
        data: {
        name,
        description,
        alertQty,
        stockQty,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        }
    })

    res.status(200).json(new ApiResponse(204, "Product updated successfully", updateProduct))

})




export { createProduct, getProductById, getProducts, deleteProductById, updateProductById }
