class ApiError extends Error {
    statusCode: number;
    details?: any;
    errorType: String
    // THE ABOVE DECLARATION IS SPECIFIC TO ts
    constructor(statusCode: number, message: string, errorType: string) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.name = "ApiError"; // Optional: Set the error name


        // Optional: Maintain proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}

export default ApiError