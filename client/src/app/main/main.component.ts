import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../shared/services/chat.service";
import {AuthService} from "../shared/services/auth.service";
import {SocketService} from "../shared/services/socket.service";

import {ContextMenuComponent} from "@syncfusion/ej2-angular-navigations";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
    @ViewChild('cardInner', {static: false}) card: ElementRef;
    public isFlipped: boolean = false;
    public isLoaded: boolean = false;
    public content: string = '';

    @ViewChild('contextmenu', {static: false}) public contextmenu: ContextMenuComponent;

    constructor(private chatService: ChatService,
                private authService: AuthService,
                private socketService: SocketService
                ) {
        if (this.authService.isAuthenticated()) {
            this.socketService.connect();
        }
    }

    public ngOnInit(): void {
        this.chatService.flipCard.subscribe(() => {
            if (this.isLoaded) {
                this.flipCardToggle();
            }
        });
    }

    public ngAfterViewInit(): void {
        this.isLoaded = true;
    }

    public flipCardToggle() {
        if (!this.isFlipped) {
            this.card.nativeElement.style.transform = 'rotateY(180deg)';
            this.isFlipped = true;
        } else {
            this.card.nativeElement.style.transform = '';
            this.isFlipped = false;
        }
    }



    onSelect(e): void {
        console.log(e);
    }
}
