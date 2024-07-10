
export class MarketCandle {
    public enter: number;
    public lowest: number;
    public exit: number;
    public peak: number;
    public quantity: number;

    public time: string;

    constructor(data: Partial<MarketCandle> = {}) {
        Object.assign(this, data);
    }
}
