import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from './providers/providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Radio Analytics';

  public pages: any = [
    { name: 'Dashboard', icon: 'dashboard', routerLink:"/dashboard" },
    { name: 'Monitor Global', icon: 'assessment', routerLink:"/monitor" }
  ];

  public user: any = { email: '' };

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.loggedin().then(res => {
      this.user = res;
      this.router.navigate(['/']);
    }).catch(err => {
      console.error(err);
      this.router.navigate(['/login']);
    });
  }

  logout() {
    this.userService.logout().then(res => {
      console.log(res);
      
    }).catch(err => {
      console.error(err);
    });
  }
}
