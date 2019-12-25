import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {config} from "../config";
import {Message} from "../models/Message";
import {SocketService} from "./socket.service";
import {DeviceDetectorService} from "ngx-device-detector";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    public flipCard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public currentRoomUsers: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);
    public theme: BehaviorSubject<string> = new BehaviorSubject<string>('light');
    public device: object = {isDesktop: 1, isMobile: 0, isTablet: 0};

    constructor(private http: HttpClient,
                private socketService: SocketService,
                private deviceDetector: DeviceDetectorService) {
    }

    public init(): void {
        this.device = {
            isDesktop: this.deviceDetector.isDesktop(),
            isMobile: this.deviceDetector.isMobile(),
            isTablet: this.deviceDetector.isTablet(),
        };
        this.socketService.listen('colorChanged').subscribe(theme => {
            this.theme.next(theme);
        });
    }

    public getRoomContent(id: string, offset?: number, limit?: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${config.API_URL}/roomContent/${id}?offset=${offset}&limit=${limit}`);
    }

    public getBlacklist(): Observable<string[]> {
        return this.http.get<string[]>(`${config.API_URL}/blacklist`);
    }

    public addToBlacklist(id: string): Observable<string[]> {
        return this.http.post<string[]>(`${config.API_URL}/blacklist`, {blacklistedId: id});
    }

    public deleteFromBlacklist(id: string): Observable<any> {
        return this.http.request('delete', `${config.API_URL}/blacklist`, {
            body: {
                blacklistedId: id,
            }
        });
    }



}
