import { Request, Response, NextFunction, RequestHandler } from "express";
import ApiResponse from "./ApiResponse";


export const asyncHandler = (callback: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};