import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http:HttpClient) { }

      getConfig(userId: string,lang:string): Observable<any> {
      return this.http.get<any>(`http://localhost:8080/api/uiconfig/${userId}/${lang}`);
    }

    
}
