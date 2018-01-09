import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { ApiService } from '../api/api.service';

import { User } from '../../models/User';

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http, public api: ApiService) { }

  /**
   * Create account
   */
  create(user: User) {
    return new Promise((resolve, reject) => {

      let seq = this.api.post('signup', user);

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

  /**
   * Login account
   */
  login(user: any) {
    return new Promise((resolve, reject) => {

      let seq = this.api.post('login', user);

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

  /**
   * Logout
   */
  logout(){
    return new Promise((resolve, reject) => {

      let seq = this.api.post('logout', null);

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }


  /**
   * User logged in
   */
  loggedin() {
    return new Promise((resolve, reject) => {

      let seq = this.api.get('loggedin');

      seq.subscribe(res => {
        resolve(res);
      }, err => {
        console.error('ERROR', err);
        reject(err);
      });
    });
  }

}
