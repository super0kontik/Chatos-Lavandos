import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    public socket: any;
    public readonly uri: string = 'http://localhost:8080';

    constructor() {
        this.socket = io(this.uri);
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
