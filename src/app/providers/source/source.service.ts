import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';

import { ApiService } from '../api/api.service';

import 'rxjs/add/operator/map';

@Injectable()
export class SourceService {

  constructor(private socket: Socket, public api: ApiService) { }


  connectToSourceRealTime(mount) {
    this.socket.emit("icsource", mount);
  }
  
  getRealTimeData(mount){
    return this.socket
      .fromEvent<any>('icsource' + mount)
      .map(data => data);
  }

  disconnect(eventName: string) {
    return this.socket.removeListener(eventName);
  }

  /**
   * Get server listeners last hour
   */
  getLastHour(mountPoint) {
    return new Promise((resolve, reject) => {
      let seq = this.api.get('api/source/' + mountPoint + '/listeners/hour');
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
  getDay(date, mountPoint: any) {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/source/' + mountPoint + '/listeners/day/' + date);

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
  getLastWeek(mountPoint: any) {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/source/' + mountPoint  + '/listeners/week');

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
  getLastMonth(mountPoint: any) {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('api/source/' + mountPoint + '/listeners/month');

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

}
