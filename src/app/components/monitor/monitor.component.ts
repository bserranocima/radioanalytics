import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Socket } from 'ng-socket-io';
import { BaseChartDirective } from 'ng2-charts';
import { ServerService } from '../../providers/providers';

import { DateHumanPipe } from '../../pipes/date-human/date-human.pipe';
import { ArrayDaysPipe } from '../../pipes/array-days/array-days.pipe';

import { MatTabChangeEvent } from '@angular/material';

import * as moment from 'moment';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  public date = new FormControl(new Date());

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
    { data: [], label: 'Oyentes en los últimos minutos' }
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

  // Day Bars chart
  public dateListenersData: Array<any> = [
    { data: [], label: 'Oyentes para el ' }
  ];

  public dateListenersLabels: Array<any> = [];
  public dateListenersLegend: boolean = true;
  public dateListenersChartType: string = 'bar';
  public dateListenersChartLegend: boolean = true;

  public dateListenersOptions: any = {
    responsive: true,
    scaleShowVerticalLines: false
  };

  public dateListenersColors: Array<any> = [
    { // blue
      backgroundColor: 'rgba(1,146,224,0.2)',
      borderColor: 'rgba(1,146,224,1)',
      pointBackgroundColor: 'rgba(1,146,224,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(1,146,224,0.8)'
    }
  ];


  // Week Day Bars chart
  public weekListenersData: Array<any> = [
    { data: [], label: 'Promedio de oyentes en la semana' }
  ];

  public weekListenersLabels: Array<any> = [];
  public weekListenersLegend: boolean = true;
  public weekListenersChartType: string = 'bar';
  public weekListenersChartLegend: boolean = true;

  public weekListenersOptions: any = {
    responsive: true,
    scaleShowVerticalLines: false
  };

  public weekListenersColors: Array<any> = [
    { // blue
      backgroundColor: 'rgba(1,146,224,0.2)',
      borderColor: 'rgba(1,146,224,1)',
      pointBackgroundColor: 'rgba(1,146,224,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(1,146,224,0.8)'
    }
  ];

  // Week Day Bars chart
  public monthListenersData: Array<any> = [
    { data: [], label: 'Promedio de oyentes en el mes' }
  ];

  public monthListenersLabels: Array<any> = [];
  public monthListenersLegend: boolean = true;
  public monthListenersChartType: string = 'bar';
  public monthListenersChartLegend: boolean = true;

  public monthListenersOptions: any = {
    responsive: true,
    scaleShowVerticalLines: false
  };

  public monthListenersColors: Array<any> = [
    { // blue
      backgroundColor: 'rgba(1,146,224,0.2)',
      borderColor: 'rgba(1,146,224,1)',
      pointBackgroundColor: 'rgba(1,146,224,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(1,146,224,0.8)'
    }
  ];

  public monitorRt;

  constructor(private serverService: ServerService, public datePipe: DateHumanPipe, public arrayDaysPipe: ArrayDaysPipe) { }

  ngOnInit() {
    this.getRealTimeListeners();
  }

  /**
   * Get real time listeners
   */
  getRealTimeListeners() {
    this.monitorRt = this.serverService.connectToServerEvents().subscribe((d) => {

      if (this.realTimeData[0].data.length > 45) {
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
  getLastHourListeners(){
    this.serverService.getLastHour()
    .then((res: any) => {
      this.lastHourData[0].data = res.map(record => { return record._listeners; });
      this.lastHourLabels = res.map(record => { return this.datePipe.transform( record.date); });
    })
    .catch(err => console.error(err));
  }

  /**
   * Get listeners from specific day
   */
  getDayListeners() {    
    let dateFormatted = this.datePipe.transform(this.date.value);

    this.serverService.getDay(this.date.value)
      .then((res: any) => {
        this.dateListenersData[0].data = res.map(record => { return Math.floor(record.listeners); });
        this.dateListenersLabels = res.map(record => { return record._id });
      })
      .catch(err => console.error(err));
  }

  /**
   * Get listeners from last week
   */
  getWeekListeners() {
    var weekDays = this.arrayDaysPipe.transform(new Date(), 'YYYY-MM-DD');
    var weekArray = [];
  

    this.serverService.getLastWeek()
      .then((res: any) => {
        weekArray = weekDays.map((day) => {
          var d = res.find(d => {return d._id == day; });
          
          if(!d)
            return {_id: day, count: 0, listeners: 0};

          return d;
          
        });

        this.weekListenersData[0].data = weekArray.map(d => Math.floor(d.listeners));
        this.weekListenersLabels = weekArray.map(d => d._id);
      })
      .catch(err => console.error(err));
  }

  /**
   * Get listeners from last month
   */
  getMonthListeners() {
    var monthDays = this.arrayDaysPipe.transform(new Date(), 'YYYY-MM-DD', 'month');
    var monthArray = [];


    this.serverService.getLastMonth()
      .then((res: any) => {
        console.log(res);
        
        monthArray = monthDays.map((day) => {
          var d = res.find(d => { return d._id == day; });

          if (!d)
            return { _id: day, count: 0, listeners: 0 };

          return d;

        });

        this.monthListenersData[0].data = monthArray.map(d => Math.floor(d.listeners));
        this.monthListenersLabels = monthArray.map(d => d._id);
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
      
      case 2:
        this.getDayListeners();
        break;

      case 3:
        this.getWeekListeners();
        break;
      
      case 4:
        this.getMonthListeners();
        break;
    }
  }

}
