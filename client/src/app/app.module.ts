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
import {MainComponent} from './main/main.component';
import {HeaderComponent} from './header/header.component';
import {ChatComponent} from './main/chat/chat.component';
import {ContactListComponent} from './main/contact-list/contact-list.component';
import {RoomComponent} from './main/room/room.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SmilesComponent} from './main/smiles/smiles.component';
import {MatCardModule} from "@angular/material/card";
import {AuthComponent} from './auth/auth.component';
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import {SetReferenceDirective} from './shared/directives/set-reference.directive';
import {SignInComponent} from './sign-in/sign-in.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {DialogAddingRoomComponent} from './dialog-adding-room/dialog-adding-room.component';
import {DialogInvitationComponent} from './dialog-invitation/dialog-invitation.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {EmojifyModule} from "angular-emojify";
import {MatRippleModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {RoomListComponent} from './main/room-list/room-list.component';
import {DialogInvitingRoomComponent} from './dialog-inviting-room/dialog-inviting-room.component';
import {SearchPipe} from './shared/pipes/search.pipe';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DialogRoomSettingsComponent} from './dialog-room-settings/dialog-room-settings.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {ContextMenuModule} from "@syncfusion/ej2-angular-navigations";
import {MatBadgeModule} from "@angular/material/badge";
import {MessageItemComponent} from './main/room/message-item/message-item.component';
import {NguiParallaxScrollModule} from "@ngui/parallax-scroll";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        AppComponent,
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
        DialogInvitationComponent,
        RoomListComponent,
        DialogInvitingRoomComponent,
        SearchPipe,
        DialogRoomSettingsComponent,
        MessageItemComponent,
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
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatRippleModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        EmojifyModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        ContextMenuModule,
        MatBadgeModule,
        NguiParallaxScrollModule
    ],
    entryComponents: [
        DialogAddingRoomComponent,
        DialogInvitationComponent,
        DialogInvitingRoomComponent,
        DialogRoomSettingsComponent,
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
