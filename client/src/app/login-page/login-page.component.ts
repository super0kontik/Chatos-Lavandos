import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public aSub: Subscription;

    constructor(
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
    }

    public ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl(
                null,
                [Validators.required, Validators.email]),
            password: new FormControl(
                null,
                [Validators.required, Validators.minLength(6)]),
        });
        this.route.queryParams.subscribe((params: Params) => {
            if (params['registered']) {
                // MaterialService.toast('Gooo!');
            } else if (params['accessDenied']) {
                // MaterialService.toast('Sorry access denied!')
            } else if (params['sessionFailed']) {
                // MaterialService.toast('Enter to the system again!');
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.aSub) {
            this.aSub.unsubscribe();
        }
    }

    public onSubmit(): void {
        this.form.disable();
        this.aSub = this.auth.login(this.form.value).subscribe(
            () => {
                console.log('Login success!');
                this.router.navigate(['/overview']);
            },
            (error) => {
                // MaterialService.toast(error['error']['message']);
                this.form.enable();
            },
        );
    }

}

