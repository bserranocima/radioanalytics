import { HttpClient, HttpParams } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ApiService {

  url: string = '';

  constructor(public http: HttpClient, @Inject(DOCUMENT) private document) {
    this.url = document.location.protocol + '//' + document.location.hostname + ':3000';
    console.log(this.url);
    
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts);
  }
}
