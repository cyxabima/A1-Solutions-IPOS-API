import { Router } from "express";
import { deleteCategoryById, getCategories, getCategoryById, createCategory, updateCategoryById } from "@/controllers/categories.controller"

const categoryRouter = Router()

// Category routes 

categoryRouter.post("/", createCategory)
categoryRouter.get("/", getCategories)
categoryRouter.get("/:id", getCategoryById)
categoryRouter.put("/:id", updateCategoryById)
categoryRouter.delete("/:id", deleteCategoryById)

export default categoryRouter

