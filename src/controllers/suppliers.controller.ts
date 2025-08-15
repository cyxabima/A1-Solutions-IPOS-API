import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import express, { NextFunction, Request, RequestHandler, Response } from "express";



const createSupplier: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            supplierType,
            name,
            contactPerson,
            phone,
            email,
            location,
            country,
            website,
            taxPin,
            registrationNumber,
            bankAccountNumber,
            bankName,
            paymentTerms,
            rating,
            notes,
        } = req.body;



        if (!name) {
            return next(new ApiError(422, "name is required", "unprocessable entity"))
        }

        const phoneExist = await db.supplier.findFirst({
            where: {
                phone: phone
            }
        });

        if (phoneExist) return next(new ApiError(409, `${phone} already taken`, "Conflict"))

        if (email) {
            const emailExist = await db.supplier.findUnique({
                where: {
                    email
                }
            })
            if (emailExist) return next(new ApiError(409, `${email} already taken`, "Conflict"))
        }

        if (registrationNumber) {
            const regExist = await db.supplier.findFirst({
                where: {
                    registrationNumber
                }
            })
            if (regExist) return next(new ApiError(409, `${registrationNumber} already exist`, "Conflict"))
        }

        const newSupplier = await db.supplier.create({
            data: {
                supplierType,
                name,
                contactPerson,
                phone,
                taxPin,
                email,
                registrationNumber,
                country,
                location,
                website,
                bankAccountNumber,
                bankName,
                paymentTerms,
                rating,
                notes,
            }
        })
        res.status(201).json(new ApiResponse(201, "supplier Created", newSupplier))
    } catch (err) {
        console.log(err)
    }



}
const getAllSuppliers: RequestHandler = async (req: Request, res: Response) => {
    const allSuppliers = await db.supplier.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "suppliers Fetched Successfully", allSuppliers))
}


const getSupplierById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const foundSupplier = await db.supplier.findFirst({ where: { id } })
    if (!foundSupplier) {
        return next(new ApiError(404, "supplier not found", "Not found"))
    }
    res.status(200).json(new ApiResponse(200, "supplier Fetched", foundSupplier))

}


export { getAllSuppliers, getSupplierById, createSupplier }