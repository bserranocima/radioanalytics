import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { BaseChartDirective } from 'ng2-charts';
import { ServerService } from '../../providers/providers';

import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  public lineChartData: Array<any> = [
    { data: [], label: 'Total oyentes' }
  ];

  public lineChartLabels: Array<any> = [];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  
  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartColors: Array<any> = [
    { // blue
      backgroundColor: 'rgba(1,146,224,0.2)',
      borderColor: 'rgba(1,146,224,1)',
      pointBackgroundColor: 'rgba(1,146,224,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(1,146,224,0.8)'
    }
  ];


  // Pie
  public doughnutChartLabels: string[] = ['Hola', 'mundo'];
  public doughnutChartData: number[] = [100,200];
  public doughnutChartType: string = 'pie';

  public monitorRt;
  public sourcesRt;
  public eventsRt;
  public sources = [];
  public events = [];

  constructor(private serverService: ServerService) {}

  ngOnInit() {
    this.getMonitorListeners();
    this.getSources();
    this.getEvents();
    this.getEventsRT();
  }

  ngOnDestroy() {
    this.serverService.disconnect('icserver');
    this.serverService.disconnect('icsources');
    this.serverService.disconnect('icevents');
    this.monitorRt.unsubscribe();
    this.sourcesRt.unsubscribe();
    this.eventsRt.unsubscribe();
  }

  /**
   * Get real time listeners from socket.io
   */
  getMonitorListeners(){
    this.monitorRt = this.serverService.connectToServerEvents().subscribe((d) => {
        this.lineChartData[0].data.push(d.listeners);
        let date = moment(d.date, "YYYY-MM-DD HH:mm:ss").format('HH:mm:ss');
        this.lineChartLabels.push(date);

      if (this.lineChartData[0].data.length > 45) {
        this.lineChartLabels.shift();
        this.lineChartData[0].data.shift();
      }

      this.chart.chart.update();
    });
  }

  /**
   * Get real time sources from socket.io
   */
  getSources() {
    this.sourcesRt = this.serverService.connectToSourcesEvents().subscribe((data) => {      
      this.sources = data;
    });
  }

  /**
   * Get real time events from server
   */
  getEventsRT() {
    this.eventsRt = this.serverService.getEvents().subscribe((data) => {
      this.events.push(data);
    });
  }

  /**
   * Get events logs from server
   */
  getEvents() {
    this.serverService.getLogs('error').then((data:any) => {
      if( data )
        this.events = data.split('\n').map(r => { return { description: r }; }).reverse();
    });
  }

}
