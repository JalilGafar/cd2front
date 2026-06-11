import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormationAdvers } from '../model/formadv';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SchoolAdvers } from '../model/school-adv';
import { API } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdversService {

  constructor(
    private http: HttpClient
  ) { }

  getFormationPub(): Observable <FormationAdvers[]> {
    return this.http.get<FormationAdvers[]>(API.ADVERS.FORMATION)
  }

  getFormationPubForShool(idSchool:number): Observable <FormationAdvers[]> {
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', idSchool);
    return this.http.get<FormationAdvers[]>(API.ADVERS.FORMATION_SCHOOL, {params: idParams})
  }

  getFormationPubByDom(idDom:number): Observable <FormationAdvers[]> {
    let idParams = new HttpParams();
    idParams = idParams.append('idDom', idDom);
    return this.http.get<FormationAdvers[]>(API.ADVERS.DOMAINE, {params: idParams})
  }

  getSchoolPub(): Observable <SchoolAdvers[]> {
    return this.http.get<SchoolAdvers[]>(API.ADVERS.SCHOOL)
  }

  


}
