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
    return this.http.get<Actualite[]>(`${environment.apiUrl}/api/Actualite`); 
  }

  getActualiteById (actualiteId:number): Observable<Actualite[]> {
    let url = `${environment.apiUrl}/api/Actualite/blog`;
    let idParams = new HttpParams();
    idParams = idParams.append('idActu', actualiteId);
    return this.http.get<Actualite[]>(url, {params: idParams})
    //return this.http.get<Actualite>(`${environment.apiUrl}/api/Actualite/${faceSnapId}`)
  }
}
