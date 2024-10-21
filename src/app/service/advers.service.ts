import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormationAdvers } from '../model/formadv';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdversService {

  constructor(
    private http: HttpClient
  ) { }

  getFormationPub(): Observable <FormationAdvers[]> {
    let url = `${environment.apiUrl}/api/advers`;
    return this.http.get<FormationAdvers[]>(url)
  }

}
