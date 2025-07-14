import { Router } from "express";
import { deleteUnitById, getUnits, getUnitById, createUnit, updateUnitById } from "@/controllers/units.controller"

const unitRouter = Router()

// Unit routes 

unitRouter.post("/", createUnit)
unitRouter.get("/", getUnits)
unitRouter.get("/:id", getUnitById)
unitRouter.put("/:id", updateUnitById)
unitRouter.delete("/:id", deleteUnitById)

export default unitRouter

