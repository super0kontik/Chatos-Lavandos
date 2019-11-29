import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {LocalStorageService} from "../shared/services/local-storage.service";
import {Router} from "@angular/router";
import {SocketService} from "../shared/services/socket.service";
import {ChatService} from "../shared/services/chat.service";

const themes = {0: 'light', 1: 'dark'};

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
    public signButton: boolean = true;
    public user: object = {name: ''};
    public isUser: boolean = false;
    public theme: string = 'dark';

    constructor(private authService: AuthService,
                private router: Router,
                private socketService: SocketService,
                private chatService: ChatService) {}

    public ngOnInit(): void {
        this.chatService.theme.subscribe(selectedTheme => {
            this.theme = selectedTheme;
        });
        this.authService.user.subscribe(user => {
            if (Object.keys(user).length > 0 && this.authService.isAuthenticated()) {
                this.user = user;
                this.isUser = true;
            } else {
                this.isUser = false;
            }
        });
        const user = LocalStorageService.getUser();
        if (user && !this.isUser && this.authService.isAuthenticated()) {
            this.user = user;
            this.isUser = true;
        } else {
            this.isUser = false;
        }
    }

    public signIn(): void {
        this.signButton = false;
    }

    public logOut(): void {
        this.signButton = true;
        LocalStorageService.logout();
        this.isUser = false;
        this.socketService.disconnect();
        this.router.navigate(['/auth']);
    }

    public toggleTheme(): void {
        if (this.theme === themes[0]) {
            this.chatService.theme.next(themes[1]);
        } else {
            this.chatService.theme.next(themes[0]);
        }
    }
}
