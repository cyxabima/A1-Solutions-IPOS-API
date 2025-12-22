import ApiError from "@/utils/ApiError";
import { NextFunction, Request, Response } from "express";

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errorType = err.errorType || "Unknown Error";

    if (statusCode < 500) {
        res.status(statusCode).json({
            success: false,
            message,
            errorType
        });
    }
    else {
        res.status(statusCode).json({
            success: false,
            message: "something went wrong",
            errorType: "internal server error"
        });
    }
    next();
};

export { errorHandler, ApiError };