import ApiError from "@/utils/ApiError";
import { NextFunction, Request, Response } from "express";

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errorType = err.errorType || "Unknown Error";

    res.status(statusCode).json({
        success: false,
        message,
        errorType
    });
    next()
};

export { errorHandler, ApiError };