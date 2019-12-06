import {Component, OnInit} from '@angular/core';
import {config} from "../shared/config";
import {LocalStorageService} from "../shared/services/local-storage.service";

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit{
    public url = config.API_URL;

    ngOnInit(): void {
        //LocalStorageService.setUser('{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZWE2ODliOTVmNTcwMmI1OGZiMmNhYiIsIm5hbWUiOiJHcm93bHkgRHVkZSIsImlhdCI6MTU3NTY0MzMwNn0.a6UL-olxgqdy6v5TpE2fEhg2nqPtZ75StD17kKcDwlc","id":"5dea689b95f5702b58fb2cab","name":"Growly Dude","isPremium":"true","colorTheme":"dark","avatar":"https://lh3.googleusercontent.com/a-/AAuE7mCaFgAlIKO8dRgB-MzS4i8q2w0jsOOLNAf87h-E"}');
    }
}
