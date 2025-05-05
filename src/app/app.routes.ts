import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { TimeEventComponent } from '../time-event/time-event.component';
import { AuthGuard } from '../auth';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'time-events/all-events', component: TimeEventComponent , canActivate:[AuthGuard]},
    { path: 'my-events', component: TimeEventComponent , canActivate:[AuthGuard]},
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
