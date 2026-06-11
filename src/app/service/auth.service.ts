import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API } from "../constants/api-endpoints";

const httpOptions = {
    headers : new HttpHeaders({'Content-Type' : 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    login (credentials: { username: string; password: string; }): Observable<any>{
        return this.http.post(API.AUTH.SIGNIN, {
            username : credentials.username,
            password: credentials.password
        }, httpOptions)
    }

    register(user: { username: string; email: string; password: string; }):  Observable<any> {
        return this.http.post(API.AUTH.SIGNUP, {
            username: user.username,
            email: user.email,
            password: user.password
        }, httpOptions)
    }


 //  private token ='MyFakeToken';

 //  getToken(): string{
 //      return this.token;
 //  }
}