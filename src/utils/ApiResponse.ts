class ApiResponse {
    // THIS DECLARATION IS SPECIFIC TO ts
    statusCode: number;
    message: string;
    data: any | null;
    error?: any;
    success: Boolean
    // In js WE HAVE ONLY DONE THIS
    constructor(statusCode: number, message: string, data: any | null = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400
    }
}

export default ApiResponse