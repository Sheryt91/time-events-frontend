import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimeEventComponent } from '../time-event/time-event.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TimeEventComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'time-tracker-app';
}
