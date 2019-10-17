import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {LoaderComponent} from "./shared/components/loader/loader.component";
import {MainComponent} from './main/main.component';
import {HeaderComponent} from './header/header.component';
import {ChatComponent} from './main/chat/chat.component';
import {ContactListComponent} from './main/contact-list/contact-list.component';
import {RoomComponent} from './main/room/room.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SmilesComponent } from './main/smiles/smiles.component';
import {MatCardModule} from "@angular/material/card";
import { AuthComponent } from './auth/auth.component';
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import { SetReferenceDirective } from './shared/directives/set-reference.directive';
import { SignInComponent } from './sign-in/sign-in.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import { DialogAddingRoomComponent } from './dialog-adding-room/dialog-adding-room.component';
import { DialogInvitationComponent } from './dialog-invitation/dialog-invitation.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        AppComponent,
        LoaderComponent,
        MainComponent,
        HeaderComponent,
        ChatComponent,
        ContactListComponent,
        RoomComponent,
        SmilesComponent,
        AuthComponent,
        SetReferenceDirective,
        SignInComponent,
        DialogAddingRoomComponent,
        DialogInvitationComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatListModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        PerfectScrollbarModule,
        HttpClientModule,
        MatCardModule,
        AppRoutingModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        DialogAddingRoomComponent,
        DialogInvitationComponent
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: TokenInterceptor
        },
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
