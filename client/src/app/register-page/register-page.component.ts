import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";


@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public aSub: Subscription;

    constructor(
        private auth: AuthService,
        private router: Router,
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
    }

    public ngOnDestroy(): void {
        if (this.aSub) {
            this.aSub.unsubscribe();
        }
    }

    public onSubmit(): void {
        this.form.disable();
        this.aSub = this.auth.register(this.form.value).subscribe(
            () => {
            this.router.navigate(['/login'], {
                queryParams: {
                    registered: true,
                }
            });
        },
            (error) => {
                // MaterialService.toast(error['error']['message']);
                this.form.enable();
            }
            );
    }
}
