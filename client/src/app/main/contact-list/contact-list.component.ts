import {
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";
import {AuthService} from "../../shared/services/auth.service";
import {MenuEventArgs, MenuItemModel} from "@syncfusion/ej2-navigations";
import {Browser} from "@syncfusion/ej2-base";
import {ContextMenuComponent} from "@syncfusion/ej2-angular-navigations";


@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
    @Input() isDisplayed: boolean;
    @ViewChild('contextmenu', {static: false}) public contextmenu: ContextMenuComponent;
    public content: string = '';
    public lastSelectedContactId: number;
    public list: object[] = [];
    public roomId: string = '';
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.2,
        scrollingThreshold: 0,
    };

    constructor(private socketService: SocketService,
                private chatService: ChatService,
                private authService: AuthService,
    ) {
    }

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.chatService.currentRoomUsers.subscribe(users => {
                this.list = users;
            });
        }
    }

    public addDisabled(args: MenuEventArgs) {
        if (args.item.text === 'Link') {
            args.element.classList.add('e-disabled');
        }
    }

    public menuItems: MenuItemModel[] = [
        {
            id: 'invite',
            text: 'Invite to the chat',
            iconCss: 'e-cm-icons e-add'
        },
        {
            separator: true
        },
        {
            id: 'ban',
            text: 'Add to blacklist',
            iconCss: 'e-cm-icons e-ban'
        }];

    public onCreated(): void {
        if (Browser.isDevice) {
            this.content = 'Touch hold to open the ContextMenu';
            this.contextmenu.animationSettings.effect = 'ZoomIn';
        } else {
            this.content = 'Right click / Touch hold to open the ContextMenu';
            this.contextmenu.animationSettings.effect = 'SlideDown';
        }
    }

    public onSelect(e): void {
        if (e.item.properties.id === 'invite') {
            console.log(`User with id: ${this.lastSelectedContactId} was invited`);
        } else if (e.item.properties.id === 'ban') {
            console.log(`User with id: ${this.lastSelectedContactId} was banned`);
        }
    }

    public onContactRightClick(user: object): void {
        this.lastSelectedContactId = user['userId'];
    }
}
