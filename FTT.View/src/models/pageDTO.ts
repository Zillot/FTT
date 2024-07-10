
export class PageDTO<T> {
    public elements: T[];
    public hasMore: boolean;
    public page: number;

    constructor(data: Partial<PageDTO<T>> = {}) {
        Object.assign(this, data);
    }
}
