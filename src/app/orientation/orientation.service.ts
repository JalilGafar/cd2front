import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, take, tap } from "rxjs";
import { degree } from "../model/degree-model";
import { field } from "../model/field-model";
import { UserProfil } from "../model/user-profil-model";
import { ville } from "../model/ville-model";
import { environment } from "../../environments/environment";
import { Contact } from "../model/contact-model";
import { BEHAVIOR } from "../model/behavior";
import { interestelt } from "../model/interest-item-model";

// import { interestelt } from "src/app/core/model/interest-item-model";


@Injectable ({
    providedIn: 'root'
})
export class OrientationService {

    constructor(private http: HttpClient) { };

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
      return this._loading$.asObservable();
    }

    TheUser!: UserProfil;
    initialUser = {
             id:0,
             city: '',
             degree: '',
             field: '',
             branche:'',
             name: '',
             surname: '',
             level: '',
             statuts:'',
             bornDate: 0,
             country: '',
             email:'',
             tel: ''
         }
    initialUser$!: Observable<UserProfil>;

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading)
    }

    scrollTo(element: string, behavior: BEHAVIOR): void {
        if (typeof document !== 'undefined') {
          let elementer = document.getElementById(element);
        
          (elementer as HTMLElement).scrollIntoView({behavior: behavior, block:"start", inline:"nearest"})
          // Manipulating the DOM here
       }
    }
  

    getAllCyties(): Observable<ville[]> {
        this.setLoadingStatus(true)
        return this.http.get<ville[]>(`${environment.apiUrl}/api/cyties`).pipe(
            tap( (cyti) => this.setLoadingStatus(false))
        )
    };

    getPartCyties(userDegree: string, userDomaine: string, userBranche: string ): Observable<ville[]> {
        this.setLoadingStatus(true)
        const url = `${environment.apiUrl}/api/partCyties`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('Degree', userDegree);
        queryParams = queryParams.append('Domaine', userDomaine);
        return this.http.get<ville[]>(url, {params: queryParams}).pipe(
            tap( (cyti) => this.setLoadingStatus(false))
        )
    }

    private _domaine$ = new BehaviorSubject<field[]>([]);
    get domaine$(): Observable<field[]> {
        return this._domaine$.asObservable();
    }



    /*Fonction qui demande de retourner les domaines pour un diplome en particulier pour toutes les villes
     Car une foi qu'o aura le diplome et le domaine d'intérêt, on enclanche getPartCyties() pour 
     avoir les villes qui offrent ces formations */
     // on charge tt les domaines pour lesquel il y a une categ de diplome en particulier
    getDomaineFromServer(domaineDegree:string){
        this.setLoadingStatus(true);
        const url = `${environment.apiUrl}/api/field`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('DomaineDegree', domaineDegree);
        this.http.get<field[]>(url, {params: queryParams}).pipe(
            take(1),
            tap(fields =>{
                this._domaine$.next(fields),
                this.setLoadingStatus(false)
            })
        ).subscribe();
    }

    getPartDomaine(domaineDegree:string, domaineCyti:string): Observable <field[]> {
        this.setLoadingStatus(true);
        const url = `${environment.apiUrl}/api/field`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('DomaineDegree', domaineDegree);
        queryParams = queryParams.append('DomaineCyti', domaineCyti);
        return this.http.get<field[]>(url, {params: queryParams}).pipe(
            tap(dom => this.setLoadingStatus(false) )
        )
    }


    private _degree$ = new BehaviorSubject<degree[]>([]);
    get degree$(): Observable<degree[]> {
        return this._degree$.asObservable();
    }

    /**Fonction qui demande au serveur de retourner les diplomes pour une ville en particulier */
    getDegreeCyti(degreeCyti:string) {
        this.setLoadingStatus(true);
        console.log("la requette des diplomes !")
        const url = `${environment.apiUrl}/api/degree`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('DegreeCyti', degreeCyti);
        return this.http.get<degree[]>(url, {params: queryParams}).pipe(
            tap(deg =>{
                this._degree$.next(deg),
                this.setLoadingStatus(false)
            })
            // tap(() => this.setLoadingStatus(false) )
        )
    };

    getDegree(degreeCyti:string) {
        this.setLoadingStatus(true);
        const url = `${environment.apiUrl}/api/degree`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('DegreeCyti', degreeCyti);
        return this.http.get<degree[]>(url, {params: queryParams}).pipe(
            tap(deg =>{
                this._degree$.next(deg),
                this.setLoadingStatus(false)
            })
            // tap(() => this.setLoadingStatus(false) )
        )
    }

    /** Fonction qui envoie demande au serveur de retourner les diplomes pour un domaine en particulier */
    getDegreeField(degreeField: string): Observable<degree[]>{
        this.setLoadingStatus(true);
        const url = `${environment.apiUrl}/api/degree`;
        let queryParams = new HttpParams();
        queryParams = queryParams.append('DegreeField', degreeField);
        return this.http.get<degree[]>(url, {params: queryParams}).pipe(
            tap(deg => this.setLoadingStatus(false) )
        )
    }

    //** FUNCTION USE TO SAVE degree, field, cyti and statut *****/

    saveStatut(degree: string, field:string, branche:string, cyti:string, statut: string) {
       this.initialUser.degree = degree;
        this.initialUser.field = field;
        this.initialUser.branche= branche;
        this.initialUser.city = cyti;
        this.initialUser.statuts = statut;
         
    }

    saveClasse(classe: string) {
         this.initialUser.level = classe;
    }

    saveContact(contact: Contact) {
        this.initialUser.name = contact.nom;
        this.initialUser.surname = contact.prenom;
        this.initialUser.bornDate = contact.born;
        this.initialUser.email = contact.email;
        this.initialUser.tel = contact.phone.internationalNumber;
        this.initialUser.country = contact.pays;
        
        this.saveClient(this.initialUser).subscribe();
        console.log(this.initialUser);
    }

    saveClient (UserInfo : UserProfil ): Observable<UserProfil> {
       return this.http.post<UserProfil>(`${environment.apiUrl}/api/result`, UserInfo)
    };

    getSerchResult(): Observable<interestelt[]> {
        const url = `${environment.apiUrl}/api/result`;
        let queryParams = {"city":this.initialUser.city,
                            "diplome":this.initialUser.degree, 
                            "domaine":this.initialUser.field,
                            "branche":this.initialUser.branche};

        return this.http.get<interestelt[]>(url, {params: queryParams})
    }

    initUser() {
        this.initialUser =  {
            id:0,
            city: '',
            degree: '',
            field: '',
            branche:'',
            name: '',
            surname: '',
            level: '',
            statuts:'',
            bornDate: 0,
            country: '',
            email:'',
            tel: ''
        }
    }
}