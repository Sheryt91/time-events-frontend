import { Injectable } from '@angular/core';
import { TimeEvent } from '../model/time-event';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimeEventService {
  private apiUrl = "http://localhost:8080/api/time-events";

constructor(private http:HttpClient,
             private authService: AuthService
  ) { }

  getConfig(userId: string, lang: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/uiconfig/${userId}/${lang}`);
  }

  getAllEvents(): Observable<TimeEvent[]> {
    return this.http.get<TimeEvent[]>(this.apiUrl);
  }

  getMyEvents():Observable<TimeEvent[]> {
    const headers = this.setAuthTokenHeader();

    return this.http.get<TimeEvent[]>('http://localhost:8080/api/time-events/my-events', { headers })
  }
  private setAuthTokenHeader() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  addTimeEvent(newEvent: TimeEvent): Observable<TimeEvent> {
    const headers = this.setAuthTokenHeader();

    return this.http.post<TimeEvent>(this.apiUrl, newEvent,{headers});
  }

  deleteEvent(id: number): Observable<void> {
    const headers=this.setAuthTokenHeader();
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{headers});
  }

  updateTimeEvent(id: number, formValue: any): Observable<TimeEvent> {
    const headers=this.setAuthTokenHeader();

    return this.http.put<TimeEvent>(`${this.apiUrl}/${id}`, formValue,{headers});
  }
}
