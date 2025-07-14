import { Router } from "express";
import { deleteBrandById, getBrands, getBrandById, createBrand, updateBrandById } from "@/controllers/brands.controller"

const brandRouter = Router()

// Brand routes 

brandRouter.post("/", createBrand)
brandRouter.get("/", getBrands)
brandRouter.get("/:id", getBrandById)
brandRouter.put("/:id", updateBrandById)
brandRouter.delete("/:id", deleteBrandById)

export default brandRouter

