import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetPopulationServiceService {

  constructor(private http: HttpClient) {}

  getData(data: object): Observable<any> {
    // todo
    let url = ''
 }
}
