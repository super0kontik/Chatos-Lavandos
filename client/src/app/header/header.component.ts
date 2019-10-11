import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {LocalStorageService} from "../shared/services/local-storage.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
    public signButton: boolean = true;
    public user: object = {
        name: '',
    };
    public isUser: boolean = false;

    constructor(private authService: AuthService, private router: Router) {
    }

    public ngOnInit(): void {
        this.authService.user.subscribe(user => {
            if (Object.keys(user).length == 0) {
                this.isUser = false;
            } else {
                console.log(user);
                this.user = user;
                this.isUser = true;
            }
        });
    }

    public signIn(): void {
        this.signButton = false;
    }

    public logOut(): void {
        this.signButton = true;
        LocalStorageService.logout();
        this.router.navigate(['/auth']);
    }

}
