import { RestResponse } from "../responseDtos/rest-response.dto"

const responseMapper = (
    {
        statusCode,
        isSuccess,
        message,
        data,
        error
    }: {
        statusCode: number,
        isSuccess: boolean,
        message: string,
        data: any,
        error: any
    }
) => {
    return new RestResponse({
        statusCode,
        isSuccess,
        message,
        data,
        error
    });
}

export {
    responseMapper
}