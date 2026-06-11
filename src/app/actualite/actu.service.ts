import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actualite } from '../model/actualite';
import { Observable } from 'rxjs';
import { API } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ActuService {

  constructor (private http: HttpClient){};

  getAllActu(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(API.ACTUALITE.BASE);
  }

  getSomeActu(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(API.ACTUALITE.SOME);
  }

  getActualiteBySubject (actualiteSubject:string): Observable<Actualite[]> {
    let SubjectParams = new HttpParams();
    SubjectParams = SubjectParams.append('subjectActu', actualiteSubject);
    return this.http.get<Actualite[]>(API.ACTUALITE.BLOG, {params: SubjectParams})
  }
}
