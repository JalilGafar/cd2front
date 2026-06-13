import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { API } from '../constants/api-endpoints';
import { Article } from '../admin/models/article.model';
import { Avis } from '../model/avis-model';
import { Ecole } from '../admin/models/ecole.model';
import { Formation } from '../admin/models/formation.model';
import { Universite } from '../admin/models/univ.model';

@Injectable({ providedIn: 'root' })
export class ModeratorService {

    constructor(private http: HttpClient) {}

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> { return this._loading$.asObservable(); }

    // ── Articles ─────────────────────────────────────────────────────────────

    private _articles$ = new BehaviorSubject<Article[]>([]);
    get articles$(): Observable<Article[]> { return this._articles$.asObservable(); }

    getArticlesFromServer(): void {
        this._loading$.next(true);
        this.http.get<Article[]>(API.ACTUALITE.BASE).pipe(
            tap(articles => { this._articles$.next(articles); this._loading$.next(false); })
        ).subscribe();
    }

    getArticleById(id: number): Observable<Article> {
        return this.articles$.pipe(
            map(list => list.find(a => a.id_actu === id)!)
        );
    }

    addNewArticle(form: {
        title: string; auteur: string; visible: boolean;
        summary: string; illustration: string; sujets: string; keywords: string; content: string;
    }): Observable<Article> {
        return this.http.post<Article>(API.ACTUALITE.BASE, form);
    }

    editArticle(form: {
        id_actu: number; title: string; auteur: string; visible: boolean;
        summary: string; illustration: string; sujets: string; keywords: string; content: string;
    }): Observable<Article> {
        return this.http.put<Article>(API.ACTUALITE.BASE, form);
    }

    deleteArticle(id: number): Observable<unknown> {
        return this.http.delete(API.ACTUALITE.BASE, { params: new HttpParams().append('idArti', id) });
    }

    // ── Avis ─────────────────────────────────────────────────────────────────

    private _avis$ = new BehaviorSubject<Avis[]>([]);
    get avis$(): Observable<Avis[]> { return this._avis$.asObservable(); }

    getAvisFromServer(): void {
        this._loading$.next(true);
        this.http.get<Avis[]>(API.AVIS).pipe(
            tap(avis => { this._avis$.next(avis); this._loading$.next(false); })
        ).subscribe();
    }

    toggleAvisVisibility(id: number, visible: boolean): Observable<unknown> {
        return this.http.put(API.AVIS, { id_avis: id, visible });
    }

    deleteAvis(id: number): Observable<unknown> {
        return this.http.delete(API.AVIS, { params: new HttpParams().append('idAvis', id) });
    }

    // ── Données lecture seule ────────────────────────────────────────────────

    private _formations$ = new BehaviorSubject<Formation[]>([]);
    get formations$(): Observable<Formation[]> { return this._formations$.asObservable(); }

    getFormationsFromServer(): void {
        this.http.get<Formation[]>(API.FORMATIONS).pipe(
            tap(f => this._formations$.next(f))
        ).subscribe();
    }

    private _ecoles$ = new BehaviorSubject<Ecole[]>([]);
    get ecoles$(): Observable<Ecole[]> { return this._ecoles$.asObservable(); }

    getEcolesFromServer(): void {
        this.http.get<Ecole[]>(API.ECOLES).pipe(
            tap(e => this._ecoles$.next(e))
        ).subscribe();
    }

    private _universites$ = new BehaviorSubject<Universite[]>([]);
    get universites$(): Observable<Universite[]> { return this._universites$.asObservable(); }

    getUniversitesFromServer(): void {
        this.http.get<Universite[]>(API.UNIVERSITES).pipe(
            tap(u => this._universites$.next(u))
        ).subscribe();
    }
}
