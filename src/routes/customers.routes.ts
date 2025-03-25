import { Router } from "express";

import { createCustomer, getAllCustomers, getCustomerById } from "@/controllers/customers.controller";


const customerRouter = Router()
customerRouter.route("/").get(getAllCustomers)
customerRouter.route("/").post(createCustomer)
customerRouter.route("/:id").get(getCustomerById)


export default customerRouter