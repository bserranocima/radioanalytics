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
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

// Pipes
import { DateHumanPipe } from './pipes/date-human/date-human.pipe';
import { ArrayDaysPipe } from './pipes/array-days/array-days.pipe';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { SourceComponent } from './components/source/source.component';
import { AccountComponent } from './components/account/account.component';
import { AccountCreateComponent } from './components/account-create/account-create.component';
import { AccountLoginComponent } from './components/account-login/account-login.component';

// Services
import { ApiService } from './providers/api/api.service';
import { UserService } from './providers/user/user.service';
import { ServerService } from './providers/server/server.service';
import { SourceService } from './providers/source/source.service';

const config: SocketIoConfig = { url: 'http://http://52.202.179.22:3000', options: { } };

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
  },

  {
    path: 'signup',
    component: AccountCreateComponent
  },

  {
    path: 'login',
    component: AccountLoginComponent
  }

];


@NgModule({
  declarations: [
    DateHumanPipe,
    ArrayDaysPipe,
    AppComponent,
    AccountComponent,
    AccountCreateComponent,
    AccountLoginComponent,
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
    SocketIoModule.forRoot(config),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [ApiService, UserService, ServerService, SourceService, DateHumanPipe, ArrayDaysPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
