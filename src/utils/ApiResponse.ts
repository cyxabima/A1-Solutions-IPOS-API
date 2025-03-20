class ApiResponse<T> {
    // THIS DECLARATION IS SPECIFIC TO ts
    statusCode: number;
    message: string;
    data: T | null;
    error?: any;
    // In js WE HAVE ONLY DONE THIS
    constructor(statusCode: number, message: string, data: T | null = null, error?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}