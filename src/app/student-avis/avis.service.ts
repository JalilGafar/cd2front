import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { EcoleAvis } from "../model/ecole-avis-model";
import { environment } from "../../environments/environment";

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
    
}