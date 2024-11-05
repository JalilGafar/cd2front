import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormationAdvers } from '../model/formadv';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SchoolAdvers } from '../model/school-adv';

@Injectable({
  providedIn: 'root'
})
export class AdversService {

  constructor(
    private http: HttpClient
  ) { }

  getFormationPub(): Observable <FormationAdvers[]> {
    let url = `${environment.apiUrl}/api/advers/formation`;
    return this.http.get<FormationAdvers[]>(url)
  }

  getFormationPubForShool(idSchool:number): Observable <FormationAdvers[]> {
    let url = `${environment.apiUrl}/api/advers/formationSchool`;
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', idSchool);
    return this.http.get<FormationAdvers[]>(url, {params: idParams})
  }
  
  getFormationPubByDom(idDom:number): Observable <FormationAdvers[]> {
    let url = `${environment.apiUrl}/api/advers/domaine`;
    let idParams = new HttpParams();
    idParams = idParams.append('idDom', idDom);
    return this.http.get<FormationAdvers[]>(url, {params: idParams})
  }

  getSchoolPub(): Observable <SchoolAdvers[]> {
    let url = `${environment.apiUrl}/api/advers/school`;
    return this.http.get<SchoolAdvers[]>(url)
  }

  


}
