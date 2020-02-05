import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../../../shared/models/Message";
import {LocalStorageService} from "../../../shared/services/local-storage.service";
import {ChatService} from "../../../shared/services/chat.service";
import {MenuEventArgs, MenuItemModel} from "@syncfusion/ej2-navigations";
import {ContextMenuComponent} from "@syncfusion/ej2-angular-navigations";
import {Browser} from "@syncfusion/ej2-base";

@Component({
    selector: 'app-message-item',
    templateUrl: './message-item.component.html',
    styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {
    @Input() message: Message;
    @Input() users: any[];
    @Output() loadRequest: EventEmitter<any> = new EventEmitter<any>();
    @Output() viewChange: EventEmitter<object> = new EventEmitter<object>();
    @ViewChild('contextmenu', {static: false}) public contextmenu: ContextMenuComponent;
    public me: string = '';
    public theme: string = 'dark';
    private content: string = '';
    public menuItems: MenuItemModel[] = [
        {
            id: 'update',
            text: 'Edit',
            iconCss: 'e-cm-icons e-edit'
        },
        {
            separator: true
        },
        {
            id: 'delete',
            text: 'Delete',
            iconCss: 'e-cm-icons e-delete'
        }];

    constructor(private chatService: ChatService) {}

    public ngOnInit(): void {
        this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
        this.me = LocalStorageService.getUser()['id'];
    }

    public onMessageRightClick(e): void {
        console.log('rightclick', e)
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
        console.log('select', e)
    }

    public messageRequest(scroll?: boolean): void {
        this.loadRequest.emit(scroll);
    }

    public viewportChange(e): void {
        if (this.message.read.indexOf(this.me) === -1 && this.me !== this.message.creator._id) {
            this.viewChange.emit({inView: e, id: this.message._id,});
        }
    }
}
