import { Component, OnInit } from '@angular/core';
import { CurrencyService } from './service/currency.service';
import { temporaryDeclaration } from '@angular/compiler/src/compiler_util/expression_converter';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})

export class CurrencyComponent implements OnInit {
  currencyList: any;
  fromCurrency: any;
  fromCurrencyDisplay: number;
  toCurrency: any;
  toCurrencyDisplay: number;
  fetchListUrl = 'https://api.exchangeratesapi.io/latest?base=INR';
  fetchTrendsUrl = 'https://api.exchangeratesapi.io/history?start_at=2019-01-01&end_at={{today}}&symbols={{from}},{{to}}&base={{base}}';
  currencyTrends: any;
  chartData: { labels: string[]; datasets: { label: any; data: any[]; fill: boolean; borderColor: string; }[]; };
  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.fetchCurrencies();
  }

  fetchCurrencies() {
    this.currencyService.getData(this.fetchListUrl).subscribe((data: any) => this.loadData(data));
  }

  loadData(data?: any) {
    this.currencyList = JSON.parse(JSON.stringify(data['rates']));
    this.fromCurrency = 'INR';
    this.toCurrency = 'INR';
    this.calculate(this.fromCurrency, this.toCurrency);
  }

  loadTrendsData(data?: any) {
    this.currencyTrends = JSON.parse(JSON.stringify(data['rates']));
    let fromData = [];
    let toData = [];
    let keys = Object.getOwnPropertyNames(this.currencyTrends);
    keys = keys.sort();
    let sortedData = [];
    for (let i in keys) {
      const obj1 = {'date': keys[i]};
      const obj2 = this.currencyTrends[keys[i]];
      const dateValue = Object.assign(obj1, obj2);
      sortedData.push(dateValue);
      fromData.push(this.currencyTrends[keys[i]][this.fromCurrency]);
      toData.push(this.currencyTrends[keys[i]][this.toCurrency]);
    }
    this.chartData = {
      labels: keys,
      datasets: [
        {
          label: this.fromCurrency,
          data: fromData,
          fill: false,
          borderColor: '#4bc0c0'
        },
        {
          label: this.toCurrency,
          data: toData,
          fill: false,
          borderColor: '#565656'
        }
      ]
    }
  }

  setFromValue(key?: any) {
    this.fromCurrency = key;
    this.calculate(this.fromCurrency, this.toCurrency);
  }

  setToValue(key?: any) {
    this.toCurrency = key;
    this.calculate(this.fromCurrency, this.toCurrency);
  }

  calculate(from?: any, to?: any) {
    from = this.currencyList[from];
    to = this.currencyList[to];
    this.fromCurrencyDisplay = from / from;
    this.toCurrencyDisplay = to / from;
  }

  getTrends() {
    const date = new Date().toISOString().split('T')[0];
    const fetchTrendsUrl = this.fetchTrendsUrl.replace('{{from}}', this.fromCurrency).replace('{{to}}', this.toCurrency).replace('{{today}}', date).replace('{{base}}', this.fromCurrency);
    this.currencyService.getData(fetchTrendsUrl).subscribe((trendsData: any) => this.loadTrendsData(trendsData));
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/