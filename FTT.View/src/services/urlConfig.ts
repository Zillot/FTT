import { environment } from '../environments/environment';

export const apiBase = environment.baseUrl;

export const MarketData = {
  getMarketData: (size: number, page: number) => `${apiBase}/MarketData?size=${size}&page=${page}`,
};
