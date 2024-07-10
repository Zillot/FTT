
export class MarketLineDTO {
    public time: Date;
    public quantity: number;
    public price: number;

    constructor(data: Partial<MarketLineDTO> = {}) {
        Object.assign(this, data);
        if (typeof this.time === 'string') {
            this.time = new Date(this.time)
        }
    }

    public get seconds(): number {
        return Math.floor(this.time.getTime() / 1000);
    }

    public get minutes(): number {
        return Math.floor(this.time.getTime() / (1000 * 60));
    }

    public get hours(): number {
        return Math.floor(this.time.getTime() / (1000 * 60 * 60));
    }

    public get days(): number {
        return Math.floor(this.time.getTime() / (1000 * 60 * 60 * 24));
    }
}
