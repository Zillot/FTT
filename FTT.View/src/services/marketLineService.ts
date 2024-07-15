import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, expand, map, of, reduce } from 'rxjs';
import { ResponseDTO } from '../models/responseDTO';
import { MarketData } from './urlConfig';
import { MarketLineDTO } from '../models/marketLineDTO';
import { PageDTO } from '../models/pageDTO';
import { MarketCandle } from '../models/marketCandle';
import { MarkedDataGroups } from '../models/markedDataGroups';
import { DatePipe } from '@angular/common';

const PAGE_SIZE = 5000;
type GetKey = (item: MarketLineDTO) => number;
type GetTime = (item: MarketLineDTO) => string;

@Injectable({ providedIn: 'root' })
export class MarketLineService {
    constructor(
        private http: HttpClient,
        private datePipe: DatePipe
    ) { 

    }

    private keyRef: { [key in MarkedDataGroups]: GetKey } = {
        [MarkedDataGroups.second]: (x) => x.seconds,
        [MarkedDataGroups.minute]: (x) => x.minutes,
        [MarkedDataGroups.hour]: (x) => x.hours,
        [MarkedDataGroups.day]: (x) => x.days,
    };

    private timeRef: { [key in MarkedDataGroups]: string } = {
        [MarkedDataGroups.second]: "dd/MM/yyyy HH:mm:ss",
        [MarkedDataGroups.minute]:"dd/MM/yyyy HH:mm",
        [MarkedDataGroups.hour]: "dd/MM/yyyy HH:00",
        [MarkedDataGroups.day]: "dd/MM/yyyy",
    };

    public getLinesPaged(page: number): Observable<ResponseDTO<PageDTO<MarketLineDTO>>> {
        return this.http.get<ResponseDTO<PageDTO<MarketLineDTO>>>(MarketData.getMarketData(PAGE_SIZE, page));
    }

    public getAllAvailabaleLines(): Observable<ResponseDTO<MarketLineDTO[]>> {
        return this.getLinesPaged(0).pipe(
            expand(response => response.result.hasMore ? this.getLinesPaged(response.result.page + 1) : EMPTY),
            reduce<ResponseDTO<PageDTO<MarketLineDTO>>, MarketLineDTO[]>((acc, response) => acc.concat(response.result.elements), []),
            map(elements => ({
                statusCode: 200,
                result: elements.map(x => new MarketLineDTO(x))
            })),
            catchError(error => {
                return of({
                    statusCode: error.status,
                    result: []
                });
            })
        );
    }

    public groupByToCandles(lines: MarketLineDTO[], group: MarkedDataGroups): MarketCandle[]  {
      let grouped: { [key: number]: MarketLineDTO[] } = this.getGroupBy(lines, this.keyRef[group])
  
      return this.generateMarketCandles(grouped, this.timeRef[group]);
    }  
        
    private getGroupBy(marketLines: MarketLineDTO[], getKey: GetKey): { [key: number]: MarketLineDTO[] } {
        return marketLines.reduce((candle, line) => {
        const key = getKey(line);
        if (!candle[key]) {
            candle[key] = [];
        }
        candle[key].push(line);
        return candle;
        }, {} as { [key: number]: MarketLineDTO[] });
    }

    private generateMarketCandles(groups: { [key: number]: MarketLineDTO[] }, timeFormat: string): MarketCandle[] {
        return Object.values(groups).map(group => {
            const enter = group[0].price;
            const exit = group[group.length - 1].price;
            const lowest = Math.min(...group.map(line => line.price));
            const peak = Math.max(...group.map(line => line.price));
            const quantity = group.reduce((sum, line) => sum + line.quantity, 0);
            const time = this.formatTime(group[0].time, timeFormat);

            return new MarketCandle({ enter, lowest, exit, peak, quantity, time: (time ?? "-")});
        });
    }


    private formatTime(time: Date, format: string): string | null {
        return this.datePipe.transform(time, format);
    }
}
