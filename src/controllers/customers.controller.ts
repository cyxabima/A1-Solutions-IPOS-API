import { db } from "@/db/db";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import express, { NextFunction, Request, RequestHandler, Response } from "express";



const createCustomer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            customerType,
            firstName,
            lastName,
            phone,
            gender,
            country,
            location,
            maxCreditLimit,
            maxCreditDays,
            taxPin,
            dob,
            email,
            NIC,
        } = req.body;


        // if (!phone) {
        //     return next(new ApiError(422, "Phone number is required", "unprocessable entity"))
        // }
        if (phone) {

            const phoneExist = await db.customer.findFirst({
                where: {
                    phone: phone
                }
            });
            if (phoneExist) return next(new ApiError(409, `${phone} already taken`, "Conflict"))
        }


        if (email) {
            const emailExist = await db.customer.findUnique({
                where: {
                    email
                }
            })
            if (emailExist) return next(new ApiError(409, `${email} already taken`, "Conflict"))
        }

        if (NIC) {
            const NICExist = await db.customer.findFirst({
                where: {
                    NIC
                }
            })
            if (NICExist) return next(new ApiError(409, `${NIC} already taken`, "Conflict"))
        }

        const newCustomer = await db.customer.create({
            data: {
                customerType,
                firstName,
                lastName,
                phone,
                gender,
                maxCreditLimit,
                maxCreditDays,
                email,
                NIC,
                country,
                location,
            }
        })
        res.status(201).json(new ApiResponse(201, "Customer Created", newCustomer))
    } catch (err) {
        console.log(err)
    }
}
)


const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
    const allCustomers = await db.customer.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(new ApiResponse(200, "Customers Fetched Successfully", allCustomers))
})


const getCustomerById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const foundCustomer = await db.customer.findFirst({ where: { id } })
    if (!foundCustomer) {
        return next(new ApiError(404, "Customer not found", "Not found"))
    }
    res.status(200).json(new ApiResponse(200, "Customer Fetched", foundCustomer))

})


export { getAllCustomers, getCustomerById, createCustomer }