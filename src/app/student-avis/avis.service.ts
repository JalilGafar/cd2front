import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { EcoleAvis } from "../model/ecole-avis-model";
import { environment } from "../../environments/environment";
import { Avis } from "../model/avis-model";
import { CampusSchool } from "../model/campusSchool-model";
import { Cursus } from "../model/cursus-model";

@Injectable ({
    providedIn: 'root'
})
export class AvisService{

    constructor (private http: HttpClient) {}

    private _ecoleAvis$ = new BehaviorSubject<EcoleAvis[]>([]);
    get ecoleAvis$(): Observable<EcoleAvis[]> {
      return this._ecoleAvis$.asObservable()
    }

    //************* ECOLE-AVIS FUNCTIONS ***************/

  getEcoleAvisFromServer(){
    this.http.get<EcoleAvis[]>(`${environment.apiUrl}/api/ecoleavis`).pipe(
      tap(ecoles =>{
        this._ecoleAvis$.next(ecoles);
      })
    ).subscribe();
  };

  //** Fonction qui permetd'avoir le résumé des avis sur une école */
  getEcoleAvisById(schoolId:number): Observable<EcoleAvis[]>{
    let url = `${environment.apiUrl}/api/ecoleavis/notes`;
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', schoolId);
    return this.http.get<EcoleAvis[]>(url, {params: idParams})
  }

  getAvisForSchoolId(schoolId:number): Observable<Avis[]>{
    let url = `${environment.apiUrl}/api/ecoleavis/school`;
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', schoolId);
    return this.http.get<Avis[]>(url, {params: idParams})
    //return this.http.get<Avis[]>(`${environment.apiUrl}/api/campus`)
  }

  sendAvis(UserAvis : Avis ){
    console.log('envoie de un avis !!!!');
    return this.http.post<Avis>(`${environment.apiUrl}/api/avis`, UserAvis)
  }

  getCampusForSchool(idSchool: number): Observable <CampusSchool[]> {
    let url = `${environment.apiUrl}/api/ecoleavis/campus`;
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', idSchool);
    return this.http.get<CampusSchool[]>(url, {params: idParams})
  }
  
  getCursusForSchool(idSchool: number): Observable <Cursus[]> {
    let url = `${environment.apiUrl}/api/ecoleavis/cursus`;
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', idSchool);
    return this.http.get<Cursus[]>(url, {params: idParams})
  }
  
  getOneCursus(idDip: number): Observable <Cursus[]> {
    let url = `${environment.apiUrl}/api/ecoleavis/diplo`;
    let idParams = new HttpParams();
    idParams = idParams.append('idDip', idDip);
    return this.http.get<Cursus[]>(url, {params: idParams})
  }
    
}