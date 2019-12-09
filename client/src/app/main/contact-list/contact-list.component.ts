import {
    Component, EventEmitter,
    Input,
    OnInit, Output,
    ViewChild,
} from '@angular/core';
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";
import {AuthService} from "../../shared/services/auth.service";
import {MenuEventArgs, MenuItemModel} from "@syncfusion/ej2-navigations";
import {Browser} from "@syncfusion/ej2-base";
import {ContextMenuComponent} from "@syncfusion/ej2-angular-navigations";
import {LocalStorageService} from "../../shared/services/local-storage.service";


@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
    @Input() isDisplayed: boolean;
    @Output() closeParticipants: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('contextmenu', {static: false}) public contextmenu: ContextMenuComponent;

    private me: string = LocalStorageService.getUser()['id'];
    private blacklist: string[] = [];
    private lastSelectedContactId: string = '';
    private content: string = '';
    public list: object[] = [];
    public roomId: string = '';
    public config: PerfectScrollbarConfigInterface = { wheelSpeed: 0.2, scrollingThreshold: 0};
    public theme: string = 'dark';
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

    constructor(private socketService: SocketService,
                private chatService: ChatService,
                private authService: AuthService) {}

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
            this.blacklist = LocalStorageService.getBlacklist();
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
        if (this.lastSelectedContactId !== this.me) {
            if (e.item.properties.id === 'invite') {
                console.log(`User with id: ${this.lastSelectedContactId} was invited`);
            } else if (e.item.properties.id === 'ban') {
                if (this.blacklist.indexOf(this.lastSelectedContactId) >= 0) {
                    this.deleteFromBlacklist();
                } else {
                    this.addToBlacklist();
                }
            }
        }
    }

    public addToBlacklist(): void {
        this.chatService.addToBlacklist(this.lastSelectedContactId).subscribe(response => {
            LocalStorageService.setBlacklist(response);
            this.blacklist = response;
        });
    }

    public deleteFromBlacklist(): void {
        this.chatService.deleteFromBlacklist(this.lastSelectedContactId).subscribe(response => {
            LocalStorageService.setBlacklist(response);
            this.blacklist = response;
        })
    }

    public onContactRightClick(user: object): void {
        this.lastSelectedContactId = user['userId'];
        if (this.lastSelectedContactId === this.me) {
            this.menuItems[0].text = '***You can not invite or';
            this.menuItems[0].iconCss = '';
            this.menuItems[2].text = 'add yourself to blacklist***';
            this.menuItems[2].iconCss = '';
            this.contextmenu.items = this.menuItems;
        } else {
            this.menuItems[0].text = 'Invite to the chat';
            this.menuItems[0].iconCss = 'e-cm-icons e-add';
            if (this.blacklist.indexOf(this.lastSelectedContactId) >= 0) {
                this.menuItems[2].text = 'Remove from blacklist';
                this.menuItems[2].iconCss = 'e-cm-icons e-add';
            } else {
                this.menuItems[2].text = 'Add to blacklist';
                this.menuItems[2].iconCss = 'e-cm-icons e-ban';
            }
            this.contextmenu.items = this.menuItems;
        }
    }
}
