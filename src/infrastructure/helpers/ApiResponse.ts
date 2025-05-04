export interface ApiResponse {
    statusCode: number;
    message: string;
    timestamp?: string;
    data: any;
}