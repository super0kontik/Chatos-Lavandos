import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";
import {BehaviorSubject, Observable} from "rxjs";
import {config} from "../config";
import {LocalStorageService} from "./local-storage.service";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: BehaviorSubject<object> = new BehaviorSubject<object>({});

    constructor(private http: HttpClient) {
    }

    //TEST
    public auth(): Observable<User> {
        return this.http.get<User>(`${config.API_URL}/mock/user`);
    }

    public isAuthenticated(): boolean {
        const token = LocalStorageService.getToken();
        return token ? !!token : true;
    }

}
