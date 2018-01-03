import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Socket } from 'ng-socket-io';

import { ApiService } from '../api/api.service';

import 'rxjs/add/operator/map';



@Injectable()
export class ServerService {

  constructor(private http: Http, public api: ApiService, private socket: Socket) {}

  connectToServerEvents() {
    return this.socket
    .fromEvent<any>('icserver')
    .map( data => data );
  }

  connectToSourcesEvents() {
    return this.socket
      .fromEvent<any>('icsources')
      .map(data => data);
  }

  getEvents() {
    return this.socket
      .fromEvent<any>('icevents')
      .map(data => data);
  }

  disconnect(eventName: string){
    return this.socket.removeListener(eventName);
  }

  /**
   * Get server logs
   */
  getLogs(type: string) {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/logs/' + type);

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

  /**
   * Get server listeners last hour
   */
  getLastHour() {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/monitor/listeners/hour');

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

  /**
   * Get server listeners specific day
   */
  getDay(date) {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/monitor/listeners/day/' + date );

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

  /**
   * Get server listeners specific day
   */
  getLastWeek() {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/monitor/listeners/week');

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

  /**
   * Get server listeners specific month
   */
  getLastMonth() {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/monitor/listeners/month');

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

}
