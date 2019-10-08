import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public signButton: boolean = true;

    constructor() {
    }

    ngOnInit() {
    }

    public signIn(): void {
        this.signButton = false;
    }

    public logOut(): void {
        this.signButton = true;
    }

}
