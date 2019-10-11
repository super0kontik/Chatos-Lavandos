import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {config} from "../shared/config";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    public signButton: boolean = true;

    constructor(private authService: AuthService) {
    }

    public signIn(): void {
        this.signButton = false;

        this.authService.authGoogle().subscribe(data => {
            console.log(data);
        });
    }

    public logOut(): void {
        this.signButton = true;
    }

}
