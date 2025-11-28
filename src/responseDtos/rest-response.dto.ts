export class RestResponse<T = any, E = any> {
    statusCode: number;
    isSuccess: boolean;
    message: string;
    data?: T;
    error?: E;

    constructor({
        statusCode = 200,
        isSuccess = true,
        message = "Success",
        data = undefined,
        error = undefined,
    }: {
        statusCode?: number;
        isSuccess?: boolean;
        message?: string;
        data?: T;
        error?: E;
    }) {
        this.statusCode = statusCode;
        this.isSuccess = isSuccess;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}
