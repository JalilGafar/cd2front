import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actualite } from '../model/actualite';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActuService {

  constructor (private http: HttpClient){};

  getAllActu(): Observable<Actualite[]> {
    //return this.topnewss;
    return this.http.get<Actualite[]>(`${environment.apiUrl}/api/actualite`); 
  }
  
  getSomeActu(): Observable<Actualite[]> {
    //return this.topnewss;
    return this.http.get<Actualite[]>(`${environment.apiUrl}/api/actualite/some`); 
  }

  getActualiteBySubject (actualiteSubject:string): Observable<Actualite[]> {
    let url = `${environment.apiUrl}/api/actualite/blog`;
    let SubjectParams = new HttpParams();
    SubjectParams = SubjectParams.append('subjectActu', actualiteSubject);
    return this.http.get<Actualite[]>(url, {params: SubjectParams})
    //return this.http.get<Actualite>(`${environment.apiUrl}/api/Actualite/${faceSnapId}`)
  }
}
