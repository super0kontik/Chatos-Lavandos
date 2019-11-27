import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import {AuthService} from "./auth.service";
import {config} from "../config";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    public socket:  any;
    public readonly uri: string = config.API_URL;
    public isConnected: boolean = false;

    constructor(private authService: AuthService) {}

    public connect(): void {
        if (this.authService.isAuthenticated() && !this.isConnected) {
            this.socket = io(this.uri, {query: `token=${LocalStorageService.getToken()}`});
            this.isConnected = true;
        } else {
            console.log('Unauthorized');
        }
    }

    public listen(eventName: string): Observable<any> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }

    public emit(eventName: string, data: any): void {
        this.socket.emit(eventName, data);
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}
