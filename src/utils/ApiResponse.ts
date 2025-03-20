class ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T | null;
    error?: any;

    constructor(statusCode: number, message: string, data: T | null = null, error?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}