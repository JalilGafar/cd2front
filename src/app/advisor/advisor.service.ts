import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { API } from '../constants/api-endpoints';
import { Categ } from '../admin/models/categ.model';
import { Domaine } from '../admin/models/domaine.model';
import { ville } from '../model/ville-model';
import { AdvisorSearchResult } from './models/advisor-search-result.model';
import { SchoolDetail, SchoolPanelData } from './models/school-detail.model';
import { AdvisorLead } from './models/advisor-lead.model';

export interface AdvisorSearchParams {
    diplome?: string;
    domaine?: string;
    ville?:   string;
    budget?:  number;
}

@Injectable({ providedIn: 'root' })
export class AdvisorService {

    constructor(private http: HttpClient) {}

    // ── Recherche (Sprint 1) ────────────────────────────────────────────────

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> { return this._loading$.asObservable(); }

    private _results$ = new BehaviorSubject<AdvisorSearchResult[]>([]);
    get results$(): Observable<AdvisorSearchResult[]> { return this._results$.asObservable(); }

    private _error$ = new BehaviorSubject<string | null>(null);
    get error$(): Observable<string | null> { return this._error$.asObservable(); }

    private _hasSearched$ = new BehaviorSubject<boolean>(false);
    get hasSearched$(): Observable<boolean> { return this._hasSearched$.asObservable(); }

    private _categories$ = new BehaviorSubject<Categ[]>([]);
    get categories$(): Observable<Categ[]> { return this._categories$.asObservable(); }

    private _domaines$ = new BehaviorSubject<Domaine[]>([]);
    get domaines$(): Observable<Domaine[]> { return this._domaines$.asObservable(); }

    private _villes$ = new BehaviorSubject<ville[]>([]);
    get villes$(): Observable<ville[]> { return this._villes$.asObservable(); }

    // Derniers paramètres de recherche — utilisés par LeadCaptureComponent pour pré-remplir
    private _lastSearchParams$ = new BehaviorSubject<AdvisorSearchParams | null>(null);
    get lastSearchParams$(): Observable<AdvisorSearchParams | null> { return this._lastSearchParams$.asObservable(); }

    // ── Fiche école (Sprint 2) ──────────────────────────────────────────────

    private _selectedSchool$ = new BehaviorSubject<SchoolPanelData | null>(null);
    get selectedSchool$(): Observable<SchoolPanelData | null> { return this._selectedSchool$.asObservable(); }

    private _schoolLoading$ = new BehaviorSubject<boolean>(false);
    get schoolLoading$(): Observable<boolean> { return this._schoolLoading$.asObservable(); }

    private _schoolError$ = new BehaviorSubject<string | null>(null);
    get schoolError$(): Observable<string | null> { return this._schoolError$.asObservable(); }

    // ── Capture lead (Sprint 2) ─────────────────────────────────────────────

    private _leadSaving$ = new BehaviorSubject<boolean>(false);
    get leadSaving$(): Observable<boolean> { return this._leadSaving$.asObservable(); }

    private _leadSuccess$ = new BehaviorSubject<boolean>(false);
    get leadSuccess$(): Observable<boolean> { return this._leadSuccess$.asObservable(); }

    private _leadError$ = new BehaviorSubject<string | null>(null);
    get leadError$(): Observable<string | null> { return this._leadError$.asObservable(); }

    // ── Méthodes Sprint 1 ───────────────────────────────────────────────────

    loadRefData(): void {
        this.http.get<Categ[]>(API.CATEG).subscribe(data => this._categories$.next(data));
        this.http.get<Domaine[]>(API.DOMAINE).subscribe(data => this._domaines$.next(data));
        this.http.get<ville[]>(API.CYTIES).subscribe(data => this._villes$.next(data));
    }

    search(params: AdvisorSearchParams): void {
        this._loading$.next(true);
        this._error$.next(null);
        this._lastSearchParams$.next(params);

        let httpParams = new HttpParams();
        if (params.diplome) httpParams = httpParams.append('diplome', params.diplome);
        if (params.domaine) httpParams = httpParams.append('domaine', params.domaine);
        if (params.ville)   httpParams = httpParams.append('city',    params.ville);

        this.http.get<AdvisorSearchResult[]>(API.RESULT, { params: httpParams }).pipe(
            catchError(() => {
                this._error$.next('Erreur lors de la recherche. Veuillez réessayer.');
                this._loading$.next(false);
                this._hasSearched$.next(true);
                return of([]);
            })
        ).subscribe(results => {
            const filtered = params.budget
                ? results.filter(r => r.cout_f <= params.budget!)
                : results;
            this._results$.next(filtered);
            this._loading$.next(false);
            this._hasSearched$.next(true);
        });
    }

    clearResults(): void {
        this._results$.next([]);
        this._error$.next(null);
        this._hasSearched$.next(false);
    }

    // ── Méthodes Sprint 2 ───────────────────────────────────────────────────

    loadSchoolDetail(id: number): void {
        this._schoolLoading$.next(true);
        this._schoolError$.next(null);
        this._selectedSchool$.next(null);

        this.http.get<SchoolDetail[]>(`${API.ADVISOR.SCHOOL}/${id}`).pipe(
            finalize(() => this._schoolLoading$.next(false)),
            catchError(err => {
                const msg = err?.error?.error || 'Impossible de charger la fiche école.';
                this._schoolError$.next(msg);
                return of([]);
            })
        ).subscribe(rows => {
            if (!rows || rows.length === 0) {
                this._schoolError$.next('Aucune donnée trouvée pour cette école.');
                return;
            }
            const panelData: SchoolPanelData = {
                ecole:      rows[0],
                formations: rows,
            };
            this._selectedSchool$.next(panelData);
        });
    }

    saveLead(lead: AdvisorLead): void {
        this._leadSaving$.next(true);
        this._leadError$.next(null);
        this._leadSuccess$.next(false);

        const payload = { ...lead, source_contact: 'advisor' };

        this.http.post<{ success: boolean; message: string }>(API.ADVISOR.LEAD, payload).pipe(
            finalize(() => this._leadSaving$.next(false)),
            catchError(err => {
                const msg = err?.error?.error || 'Erreur lors de l\'enregistrement du prospect.';
                this._leadError$.next(msg);
                return of(null);
            })
        ).subscribe(resp => {
            if (resp?.success) {
                this._leadSuccess$.next(true);
            }
        });
    }

    clearSchool(): void {
        this._selectedSchool$.next(null);
        this._schoolError$.next(null);
        this._leadSuccess$.next(false);
        this._leadError$.next(null);
    }
}
