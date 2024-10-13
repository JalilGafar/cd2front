import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { EcoleAvis } from "../model/ecole-avis-model";
import { environment } from "../../environments/environment";
import { Avis } from "../model/avis-model";

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

  getAvisForSchoolId(schoolId:number): Observable<Avis[]>{
    let url = `${environment.apiUrl}/api/ecoleavis/school`;
    let idParams = new HttpParams();
    idParams = idParams.append('idSchool', schoolId);
    return this.http.get<Avis[]>(url, {params: idParams})
    //return this.http.get<Avis[]>(`${environment.apiUrl}/api/campus`)
  }
    
}