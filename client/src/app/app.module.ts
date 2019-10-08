import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {LoaderComponent} from "./shared/components/loader/loader.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './main/chat/chat.component';
import { ContactListComponent } from './main/contact-list/contact-list.component';
import { RoomComponent } from './main/room/room.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@NgModule({
    declarations: [
        AppComponent,
        LoaderComponent,
        MainComponent,
        HeaderComponent,
        ChatComponent,
        ContactListComponent,
        RoomComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatListModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
