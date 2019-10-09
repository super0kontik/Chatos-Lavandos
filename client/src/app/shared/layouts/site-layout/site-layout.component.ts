import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-site-layout',
	templateUrl: './site-layout.component.html',
	styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements OnInit {
	constructor(
	    private auth: AuthService,
      	private router: Router,
    ) {
	}

	ngOnInit() {
	}

	public logout(event: Event) {
        event.preventDefault();
        this.auth.logout();
        this.router.navigate(['/login']);
    }

}
