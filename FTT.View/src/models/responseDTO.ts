
export class ResponseDTO<T> {
    public statusCode: number;
    public result: T;

    constructor(data: Partial<ResponseDTO<T>> = {}) {
        Object.assign(this, data);
    }
}
