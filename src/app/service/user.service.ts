import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API } from '../constants/api-endpoints';

interface EtsForm {
    nom : string;
    prenom: string;
    etablissement: string;
    ville: string;
    comment: string;
    email:  string;
    phone:string;
  }

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient){}

    getPublicContent(): Observable<any>{
        return this.http.get(API.TEST.ALL, {responseType: 'text'})
    }
    getUserBoard(): Observable<any>{
        return this.http.get(API.TEST.USER, {responseType: 'text'})
    }
    getModeratorBoard(): Observable<any>{
        return this.http.get(API.TEST.MOD, {responseType: 'text'})
    }
    getAdminBoard(): Observable<any>{
        return this.http.get(API.TEST.ADMIN, {responseType: 'text'})
    }

    postEts(etsForm: {nom : string, prenom: string, etablissement: string, ville: string;
                    comment: string, email:  string, phone:string;}): Observable <EtsForm> {
        console.log(etsForm);
        return this.http.post<EtsForm>(API.ETS, etsForm);
    }
   // getAdminBoard(): Observable<any>{
   //     return this.http.get(API_URL + 'admin')
   // }
}
