import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: BehaviorSubject<object> = new BehaviorSubject<object>({});

    constructor(private http: HttpClient) {
    }

    public isAuthenticated(): boolean {
        const token = LocalStorageService.getToken();
        return token ? !!token : false;
    }
}
