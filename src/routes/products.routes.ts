import { Router } from "express";
import { deleteProductById, getProducts, getProductById, createProduct, updateProductById } from "@/controllers/products.controller"

const productRouter = Router()

// Product routes 

productRouter.post("/", createProduct)
productRouter.get("/", getProducts)
productRouter.get("/:id", getProductById)
productRouter.put("/:id", updateProductById)
productRouter.delete("/:id", deleteProductById)

export default productRouter

