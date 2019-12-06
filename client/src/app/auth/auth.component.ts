import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../shared/services/local-storage.service";
import {AuthService} from "../shared/services/auth.service";
import {SocketService} from "../shared/services/socket.service";
import {ChatService} from "../shared/services/chat.service";
import {User} from "../shared/models/User";

@Component({
    selector: 'app-auth',
    template: '',
})
export class AuthComponent implements OnInit {
    public user: User;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private socketService: SocketService,
                private chatService: ChatService) {}

    public ngOnInit(): void {
        this.user = this.route.snapshot.queryParams as User;
        LocalStorageService.setUser(JSON.stringify(this.user));
        const aSub = this.chatService.getBlacklist().subscribe(blacklist => {
            LocalStorageService.setBlacklist(blacklist);
            aSub.unsubscribe();
        });
        this.socketService.connect();
        this.authService.user.next(this.user);
        this.router.navigate(['/chat']);
    }
}
