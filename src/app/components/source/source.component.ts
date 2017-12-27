import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { BaseChartDirective } from 'ng2-charts';
import { SourceService } from '../../providers/providers';

import { DateHumanPipe } from '../../pipes/date-human/date-human.pipe';
import { ArrayDaysPipe } from '../../pipes/array-days/array-days.pipe';

import { MatTabChangeEvent } from '@angular/material';

import * as moment from 'moment';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  mountName: string = '';

  // Real time chart
  public realTimeData: Array<any> = [
    { data: [], label: 'Total oyentes' }
  ];

  public realTimeLabels: Array<any> = [];
  public realTimeLegend: boolean = true;
  public realTimeChartType: string = 'line';

  public realTimeOptions: any = {
    responsive: true
  };

  public realTimeColors: Array<any> = [
    {
      backgroundColor: 'rgba(1,146,224,0.2)',
      borderColor: 'rgba(1,146,224,1)',
      pointBackgroundColor: 'rgba(1,146,224,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(1,146,224,0.8)'
    }
  ];

  // Last hour line chart
  public lastHourData: Array<any> = [
    { data: [], label: '' }
  ];

  public lastHourLabels: Array<any> = [];
  public lastHourLegend: boolean = true;
  public lastHourChartType: string = 'line';

  public lastHourOptions: any = {
    responsive: true,
    elements: { point: { radius: 0 } }
  };

  public lastHourColors: Array<any> = [
    { // blue
      backgroundColor: 'rgba(1,146,224,0.2)',
      borderColor: 'rgba(1,146,224,1)',
      pointBackgroundColor: 'rgba(1,146,224,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(1,146,224,0.8)'
    }
  ];

  public sourceRT; 

  constructor(private activatedRoute: ActivatedRoute, private sourceService: SourceService, public datePipe: DateHumanPipe, public arrayDaysPipe: ArrayDaysPipe) { }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.mountName = params['name'];
      console.log(this.mountName);
      this.sourceService.connectToSourceRealTime(this.mountName);
      this.getRealTimeListeners();
    });


  }

  ngOnDestroy() {
    this.sourceService.disconnect('icsource'+this.mountName);
    this.sourceRT.unsubscribe();

  }

  /**
   * Get real time listeners
   */
  getRealTimeListeners() {
    this.sourceRT = this.sourceService.getRealTimeData(this.mountName).subscribe((d) => {
      
      if (this.realTimeData[0].data.length > 100) {
        this.realTimeLabels.shift();
        this.realTimeData[0].data.shift();
      } else {
        this.realTimeData[0].data.push(d.listeners);
        let date = moment(d.date, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss');
        this.realTimeLabels.push(date);
      }

      this.chart.chart.update();
    });
  }

  /**
   * Get listeners from the last hour
   */
  getLastHourListeners() {
    this.sourceService.getLastHour(this.mountName)
      .then((res: any) => {
        console.log(res);
        this.lastHourData[0].label = 'Oyentes de ' + this.mountName;
        this.lastHourData[0].data = res.map(record => { return record._listeners; });
        this.lastHourLabels = res.map(record => { return this.datePipe.transform(record.date); });
      })
      .catch(err => console.error(err));
  }


  /**
   * Event triggered when tab change
   */
  onTabClick(event: MatTabChangeEvent) {
    switch (event.index) {
      case 1:
        this.getLastHourListeners();
        break;

      // case 2:
      //   this.getDayListeners();
      //   break;

      // case 3:
      //   this.getWeekListeners();
      //   break;

      // case 4:
      //   this.getMonthListeners();
      //   break;
    }
  }

}
