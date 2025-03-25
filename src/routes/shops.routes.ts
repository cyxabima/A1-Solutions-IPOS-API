import { createShop, getShopAttendants, getShopById } from "@/controllers/shops.controller";
import { Router } from "express";

const shopRouter = Router();

shopRouter.post("/", createShop)
shopRouter.get("/:shopId", getShopById)
shopRouter.get("/attendants/:shopId", getShopAttendants)

export default shopRouter