import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../shared/services/local-storage.service";
import {AuthService} from "../shared/services/auth.service";
import {SocketService} from "../shared/services/socket.service";

@Component({
    selector: 'app-auth',
    template: '',
})
export class AuthComponent implements OnInit {
    public user: object;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private socketService: SocketService) {}

    public ngOnInit(): void {
        this.user = this.route.snapshot.queryParams;
        LocalStorageService.setUser(JSON.stringify(this.user));
        LocalStorageService.setBlacklist(this.user['blacklist']);
        this.socketService.connect();
        this.authService.user.next(this.user);
        this.router.navigate(['/chat']);
    }
}
