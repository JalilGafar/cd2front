import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { interestelt } from "../model/interest-item-model";
import { environment } from "../../environments/environment";
import { Metier } from "../model/metier";
import { Etablissement } from "../model/etablissement-model";
import { Formation } from "../admin/models/formation.model";
import { EcoleFind } from "../model/ecoleFind-model";
import { Domaine } from "../admin/models/domaine.model";


@Injectable({
    providedIn: 'root'
  })

export class InfoServices {

    constructor(private http: HttpClient) { };

    getFirstInterestSchool(page : string): Observable<interestelt[]> {
        const url = `${environment.apiUrl}/api/interest`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('Page', page);
        return this.http.get<interestelt[]>(url, {params: queryParams})
    };

    getAdvers(page : string): Observable<interestelt[]> {
        const url = `${environment.apiUrl}/api/advers`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('Page', page);
        return this.http.get<interestelt[]>(url, {params: queryParams})
    }

    getMetierList(): Observable<[{id_metier:number, titre:string}]>{
        const url = `${environment.apiUrl}/api/metier/list`;
        return this.http.get<[{id_metier:number, titre:string}]>(url)
    }
    getMetierLongList(): Observable<[{id_metier:number, titre:string}]>{
        const url = `${environment.apiUrl}/api/metier/longlist`;
        return this.http.get<[{id_metier:number, titre:string}]>(url)
    }

    getMetierById(idMetier:number):Observable<Metier[]> {
        let url = `${environment.apiUrl}/api/metier`;
        let idParams = new HttpParams();
        idParams = idParams.append('idMetier', idMetier);
        return this.http.get<Metier[]>(url, {params: idParams})
    }

    getFiliereById(idFiliere:number):Observable<Domaine[]>{
        let url = `${environment.apiUrl}/api/field/item`;
        let idParams = new HttpParams();
        idParams = idParams.append('idFiliere', idFiliere);
        return this.http.get<Domaine[]>(url, {params: idParams})
    }

    getEcoleById(idEcole:number):Observable <Etablissement[]> {
        let url = `${environment.apiUrl}/api/ecoles/etablissement`;
        let idParams = new HttpParams();
        idParams = idParams.append('idEcole', idEcole);
        return this.http.get<Etablissement[]>(url, {params: idParams})

    }

    getFormationById(idForm:number){
        let url = `${environment.apiUrl}/api/formations/info`;
        let idParams = new HttpParams();
        idParams = idParams.append('idForm', idForm);
        return this.http.get<Formation[]>(url, {params: idParams})
    }

    getEcoleFind(): Observable <EcoleFind[]>{
        return this.http.get<EcoleFind[]>(`${environment.apiUrl}/api/ecoles/find`)
    }

    getDomainList():Observable<Domaine[]>{
        return this.http.get<Domaine[]>(`${environment.apiUrl}/api/field/page`)
    }

    getBranche():Observable< {branche_dom:string} []>{
        return this.http.get<{branche_dom:string} []>(`${environment.apiUrl}/api/field/br`)
    }

}