import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimeEventComponent } from '../time-event/time-event.component';
import { LoginComponent } from '../login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/AuthInterceptor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'time-tracker-app';
}
