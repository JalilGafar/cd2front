import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { EcoleAvis } from "../model/ecole-avis-model";
import { Avis } from "../model/avis-model";
import { CampusSchool } from "../model/campusSchool-model";
import { Cursus } from "../model/cursus-model";
import { API } from "../constants/api-endpoints";

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
    this.http.get<EcoleAvis[]>(API.ECOLE_AVIS.BASE).pipe(
      tap(ecoles =>{
        this._ecoleAvis$.next(ecoles);
      })
    ).subscribe();
  };

  //** Fonction qui permetd'avoir le résumé des avis sur une école */
  getEcoleAvisById(schoolId:number): Observable<EcoleAvis[]>{
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', schoolId);
    return this.http.get<EcoleAvis[]>(API.ECOLE_AVIS.NOTES, {params: idParams})
  }

  getAvisForSchoolId(schoolId:number): Observable<Avis[]>{
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', schoolId);
    return this.http.get<Avis[]>(API.ECOLE_AVIS.SCHOOL, {params: idParams})
  }

  sendAvis(UserAvis : Avis ){
    console.log('envoie de un avis !!!!');
    return this.http.post<Avis>(API.AVIS, UserAvis)
  }

  getCampusForSchool(idSchool: number): Observable <CampusSchool[]> {
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', idSchool);
    return this.http.get<CampusSchool[]>(API.ECOLE_AVIS.CAMPUS, {params: idParams})
  }

  getCursusForSchool(idSchool: number): Observable <Cursus[]> {
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', idSchool);
    return this.http.get<Cursus[]>(API.ECOLE_AVIS.CURSUS, {params: idParams})
  }

  getOneCursus(idDip: number): Observable <Cursus[]> {
    let idParams = new HttpParams();
    idParams = idParams.append('idDip', idDip);
    return this.http.get<Cursus[]>(API.ECOLE_AVIS.DIPLO, {params: idParams})
  }
    
}