import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {ReactiveFormsModule} from "@angular/forms";
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
        AppRoutingModule
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
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
