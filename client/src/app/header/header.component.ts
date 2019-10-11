import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {config} from "../shared/config";
import {LocalStorageService} from "../shared/services/local-storage.service";

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
    public isGetingUser: boolean = false;

    constructor(private authService: AuthService) {
    }

    public ngOnInit(): void {
        this.authService.user.subscribe(user => {
            if (Object.keys(user).length == 0) {
                this.isGetingUser = false;
            } else {
                console.log(user);
                this.user = user;
                this.isGetingUser = true;
            }
        });
    }

    public signIn(): void {
        this.signButton = false;
    }

    public logOut(): void {
        this.signButton = true;
    }

}
