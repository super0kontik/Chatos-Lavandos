import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../shared/services/chat.service";
import {AuthService} from "../shared/services/auth.service";
import {SocketService} from "../shared/services/socket.service";
import {MenuEventArgs, MenuItemModel} from "@syncfusion/ej2-navigations";
import {Browser} from "@syncfusion/ej2-base";
import {ContextMenuComponent} from "@syncfusion/ej2-angular-navigations";
import {log} from "util";

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

    public addDisabled  (args: MenuEventArgs) {
        console.log(1);
        if (args.item.text === 'Link') {
            args.element.classList.add('e-disabled');
        }
    }

    // ContextMenu items definition
    public menuItems: MenuItemModel[] = [
        {
            text: 'Cut',
            iconCss: 'e-cm-icons e-cut'
        },
        {
            text: 'Copy',
            iconCss: 'e-cm-icons e-copy'
        },
        {
            text: 'Paste',
            iconCss: 'e-cm-icons e-paste',
            items: [
                {
                    text: 'Paste Text',
                    iconCss: 'e-cm-icons e-pastetext'
                },
                {
                    text: 'Paste Special',
                    iconCss: 'e-cm-icons e-pastespecial'
                }
            ]
        },
        {
            separator: true
        },
        {
            text: 'Link',
            iconCss: 'e-cm-icons e-link'
        },
        {
            text: 'New Comment',
            iconCss: 'e-cm-icons e-comment'
        }];

    // Event triggers once the context menu rendering is completed.
    onCreated(): void {
        if (Browser.isDevice) {
            this.content = 'Touch hold to open the ContextMenu';
            this.contextmenu.animationSettings.effect = 'ZoomIn';
        } else {
            this.content = 'Right click / Touch hold to open the ContextMenu';
            this.contextmenu.animationSettings.effect = 'SlideDown';
        }
    }

    onSelect(e): void {
        console.log(e);
    }
}
