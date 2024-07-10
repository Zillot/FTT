import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MarketCandle } from '../../models/marketCandle';

@Component({
  selector: 'exDataTable',
  templateUrl: './dataTable.component.html',
  styleUrls: ['./dataTable.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() candles: MarketCandle[];
  
  constructor(
  ) {

  }

  public ngOnInit(): void {

  }

  public isUp(candle: MarketCandle) {
    return candle.enter < candle.exit;
  }

  public isDown(candle: MarketCandle) {
    return candle.enter > candle.exit;
  }
}
