import { Component } from '@angular/core';
import { MarketLineService } from '../../services/marketLineService';
import { MarketLineDTO } from '../../models/marketLineDTO';
import { MarkedDataGroups } from '../../models/markedDataGroups';
import { MarketCandle } from '../../models/marketCandle';
import { group } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public MarkedDataGroups = MarkedDataGroups;

  public lines: MarketLineDTO[];
  public candles: MarketCandle[];

  public filterSelected: MarkedDataGroups;

  public loading: boolean;

  constructor(private marketDataService: MarketLineService) {
    this.filterSelected = MarkedDataGroups.minute;
  }

  public loadData() {
    this.loading = true;

    this.marketDataService.getAllAvailabaleLines().subscribe(res => {
      this.lines = res.result;

      if (this.filterSelected != null) {
        this.groupBy(this.filterSelected);
      }
      
      this.loading = false;
    });
  }

  public groupBy(group: MarkedDataGroups) {
    this.filterSelected = group;
    this.candles = this.marketDataService.groupByToCandles(this.lines, this.filterSelected);
  }  
}
