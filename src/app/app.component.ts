import { Component } from '@angular/core';

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
}
