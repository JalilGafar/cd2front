import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormationAdvers } from '../model/formadv';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  getSchoolPub(): Observable <SchoolAdvers[]> {
    let url = `${environment.apiUrl}/api/advers/school`;
    return this.http.get<SchoolAdvers[]>(url)
  }

}
