import { Router } from "express";

import { createSupplier, getAllSuppliers, getSupplierById } from '@/controllers/suppliers.controller'


const supplierRouter = Router()
supplierRouter.route("/").get(getAllSuppliers)
supplierRouter.route("/").post(createSupplier)
supplierRouter.route("/:id").get(getSupplierById)


export default supplierRouter