// Modules
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material';
import { MaterialModule } from './modules/material/material.module';

// Pipes
import { DateHumanPipe } from './pipes/date-human/date-human.pipe';
import { ArrayDaysPipe } from './pipes/array-days/array-days.pipe';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { SourceComponent } from './components/source/source.component';

// Services
import { ApiService } from './providers/api/api.service';
import { ServerService } from './providers/server/server.service';
import { SourceService } from './providers/source/source.service';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: { } };

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'source/:name',
    component: SourceComponent
  },

  {
    path: 'monitor',
    component: MonitorComponent
  }
];


@NgModule({
  declarations: [
    DateHumanPipe,
    ArrayDaysPipe,
    AppComponent,
    DashboardComponent,
    MonitorComponent,
    SourceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MaterialModule,
    ChartsModule,
    RouterModule.forRoot(ROUTES), // Add routes to the app
    SocketIoModule.forRoot(config)
  ],
  providers: [ApiService, ServerService, SourceService, DateHumanPipe, ArrayDaysPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
