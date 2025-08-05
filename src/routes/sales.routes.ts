import { Router } from "express";
import { createSales, addItemToSale, getSaleById, getSales, getShopSales } from "@/controllers/sales.controller";
const salesRouter = Router()

// sales routes 

salesRouter.post("/", createSales)
salesRouter.get("/", getSales)
salesRouter.get("/:id", getSaleById)
salesRouter.get("/shop/:id", getShopSales)
salesRouter.patch("/:saleId/item", addItemToSale)


export default salesRouter

