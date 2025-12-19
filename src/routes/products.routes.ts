import { Router } from "express";
import { deleteProductById, getProducts, getProductById, createProduct, updateProductById, searchProducts } from "@/controllers/products.controller"

const productRouter = Router()

// Product routes 

productRouter.post("/", createProduct)
productRouter.get("/", getProducts)
productRouter.get("/search", searchProducts)
productRouter.get("/:id", getProductById)
productRouter.put("/:id", updateProductById)
productRouter.delete("/:id", deleteProductById)

export default productRouter

