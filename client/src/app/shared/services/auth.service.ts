import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";
import {Observable} from "rxjs";
import {config} from "../config";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    public auth(): Observable<User> {
        return this.http.get<User>(`${config.API_URL}/mock/user`);
    }

    public authGoogle(): Observable<any> {
        return this.http.get<any>(`${config.API_URL}/auth`);
    }
}
