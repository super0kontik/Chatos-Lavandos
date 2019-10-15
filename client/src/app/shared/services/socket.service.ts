import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import {AuthService} from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    public socket: any;
    public readonly uri: string = 'http://localhost:8080';

    constructor(private authService: AuthService) {
        if (this.authService.isAuthenticated()) {
            this.socket = io(this.uri, {
                query: `token=${LocalStorageService.getToken()}`,
            });
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
}
