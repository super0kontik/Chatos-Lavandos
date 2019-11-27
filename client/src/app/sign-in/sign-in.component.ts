import {Component} from '@angular/core';
import {config} from "../shared/config";

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
    public url = config.API_URL;

}
