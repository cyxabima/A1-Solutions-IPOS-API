import { db } from "@/db/db";
import express, { Request, RequestHandler, Response } from "express";



const createCustomer: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { name, email, phone } = req.body;
        if ([name, email, phone].some((any) => any.trim() == '')) {
            res.json({
                message: "all fields required"
            })
            return
        }

        const newCustomer = await db.customer.create({ data: { name, email, phone } })
        res.status(201).json(newCustomer)
    } catch (err) {
        console.log(err)
    }



}
const getAllCustomers: RequestHandler = async (req: Request, res: Response) => {
    const allCustomers = await db.customer.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    res.status(200).json(allCustomers)
}
const getCustomerById: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params
    const foundCustomer = await db.customer.findFirst({ where: { id } })
    res.json(foundCustomer)

}


export { getAllCustomers, getCustomerById, createCustomer }