import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from "./main/main.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {SignInComponent} from "./sign-in/sign-in.component";


const routes: Routes = [
    {path: '', component: MainComponent, canActivate: [AuthGuard]},
    {path: 'auth', component: AuthComponent},
    {path: 'signIn', component: SignInComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
