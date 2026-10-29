export type axiosResponse<T> = {
    success: string;
    message: string;
    data: {
            [key: string]: T;
    };
};