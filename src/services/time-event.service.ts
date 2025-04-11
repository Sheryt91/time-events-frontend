import { Injectable } from '@angular/core';
import { TimeEvent } from '../model/time-event';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeEventService {
   

  private apiUrl ="http://localhost:8080/api/time-events";
  

  constructor(private http:HttpClient) { }

 // getConfig(userId: string, lang: string): Observable<any> {
  // return this.http.get(`/api/uiconfig/${userId}/${lang}`);

    getConfig(userId: string,lang:string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/uiconfig/${userId}/${lang}`);
  }
  getAllEvents():Observable<TimeEvent[]> {
   return this.http.get<TimeEvent[]>(this.apiUrl);
  }
  addTimeEvent(newEvent: TimeEvent):Observable<TimeEvent> {
    return this.http.post<TimeEvent>(this.apiUrl,newEvent);
  }

  deleteEvent(index: number) {
    return this.http.delete<TimeEvent[]>(this.apiUrl+"/"+index);
  }
  updateTimeEvent(id:number,formValue: any) {
    return this.http.put<TimeEvent>(this.apiUrl+"/"+id,formValue);
  }
}
